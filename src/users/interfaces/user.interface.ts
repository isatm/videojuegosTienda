import mongoose from 'mongoose';
import {
    ChangePasswordDto,
    CreateUserDto,
    LoginDto,
    ResendVerificationCodeDto,
    UpdateUserDto,
    VerifyEmailDto
  } from '../dto/user.dto';
  
  export interface User {
    _id: mongoose.Schema.Types.ObjectId;     
    id?: string;           
    nickname: string;
    email: string;
    isVerified: boolean;
    role: string;
    balance: number;
    gamesPurchased?: mongoose.Schema.Types.ObjectId[];
    gamesPublished?: mongoose.Schema.Types.ObjectId[];
    refreshToken?: string;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface UserServiceInterface {
    create(createUserDto: CreateUserDto): Promise<User>;
    login(
      loginDto: LoginDto,
    ): Promise<{user:User, token:string, refresh:string}>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<User>;
    resendVerificationCode(resendVerificationCodeDto: ResendVerificationCodeDto): Promise<User>;
    recharge(userId: string, delta: number): Promise<User>;
    addPurchasedGame(userId: string, gameId: string): Promise<void>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    refreshToken(
      refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }>;
    changePassword(
      id: string,
      changePasswordDto: ChangePasswordDto,
    ): Promise<void>;
}
  