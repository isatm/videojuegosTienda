import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User as SchemaUser, UserDocument } from './schema/user.schema';
import { ChangePasswordDto, CreateUserDto, LoginDto, RefreshTokenDto, ResendVerificationCodeDto, UpdateUserDto, VerifyEmailDto } from './dto/user.dto';
import { EmailService } from '../email/email.service';
import { User, UserServiceInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService implements UserServiceInterface {
  constructor(
    @InjectModel(SchemaUser.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService
  ) {}

  private toUserInterface(userDoc: UserDocument): User {
    const userObj = userDoc.toObject();
    userObj.id = userObj._id.toString();
    delete userObj.password;
    delete userObj._id;
    delete userObj.__v;
    return userObj as User;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    //User exception
    const existingUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    //Nickname exception
    const nicknameOccupated = await this.userModel.findOne({ nickname: createUserDto.nickname }).exec();
    if (nicknameOccupated) {
      throw new ConflictException('Nickname already registered');
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    //Verification
    //Create Code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(verificationCodeExpires.getMinutes() + 2);

    //Create new user
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      verificationCode: verificationCode,
      verificationCodeExpires: verificationCodeExpires
    });

    //Send email
    await this.emailService.sendVerificationEmail(
      newUser.email,
      newUser.nickname,
      verificationCode,
    );

    const savedUser = await newUser.save();

    return this.toUserInterface(savedUser);
  }

  async resendVerificationCode(resendVerificationCodeDto: ResendVerificationCodeDto): Promise<User> {
    const user = await this.userModel.findOne({ email: resendVerificationCodeDto.email }).exec()

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //Recreate Code
    user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    user.verificationCodeExpires = new Date();
    user.verificationCodeExpires.setMinutes(user.verificationCodeExpires.getMinutes() + 2);

    //Send email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.nickname,
      user.verificationCode,
    );

    const savedUser = await user.save();

    return this.toUserInterface(savedUser);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<User> {
    const { email, code } = verifyEmailDto;
    const user = await this.userModel.findOne({ email }).exec();
    
    //ExistUserValidation 
    if (!user) {
        throw new NotFoundException('User not found');
    }

    //UserisVerified validation
    if (user.isVerified) {
        throw new BadRequestException('Email already verified');
    }

    //VerificationCode validation
    if (user.verificationCode !== code) {
        throw new BadRequestException('Invalid verification code');
    }

    //VerificationCodeExpiration validation
    if (user.verificationCodeExpires && new Date() > user.verificationCodeExpires) {
        throw new BadRequestException('Verification code expired');
    }
    
    //Update user verification status
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    const updatedUser = await user.save();

    return this.toUserInterface(updatedUser);
  }

  async login(loginDto: LoginDto): Promise<{user: User, token: string, refresh: string}> {
    const user = await this.userModel.findOne({ email: loginDto.email }).exec();
    
    //ExistUserValidation
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //UserisNotVerifiedValidation
    if (!user.isVerified){
      throw new UnauthorizedException('Not verified email');
    }

    //Compare passwords
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //Generate tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    user.refreshToken = hashedRefreshToken;

    //Save user in mongoDB
    const updatedUser = await user.save();

    const responseUser = this.toUserInterface(updatedUser);

    return {
      user: responseUser,
      token: tokens.accessToken,
      refresh: tokens.refreshToken
    }
  }

  //---

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      //Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      //Find user
      const user = await this.userModel.findById(payload.sub).exec();
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      //Validate stored refresh token
      if (!user.refreshToken) {
        throw new UnauthorizedException('Invalid token');
      }
      
      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken
      );
      
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid token');
      }

      //Generate new tokens
      const tokens = await this.getTokens(user.id, user.email, user.role);
      
      //Update refresh token in database
      const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
      user.refreshToken = hashedRefreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    //Verify current password
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    //Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => this.toUserInterface(user));
  }

  async findOne(id: string): Promise<User> {
    // Validar que el creatorId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID invalid');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return this.toUserInterface(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return this.toUserInterface(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    //If updating email, check if new email is already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email }).exec();
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
    }

    //If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    //Update user
    Object.assign(user, updateUserDto);
    const updatedUser = await user.save();
    return this.toUserInterface(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  private async getTokens(userId: string, email: string, role: string): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}