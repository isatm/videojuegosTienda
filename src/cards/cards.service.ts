import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Card, CardDocument } from './schema/card.schema';
import { UsersService } from 'src/users/user.service';
import { RegisterCardDto } from './dto/card.dto';
import { Model, Types } from 'mongoose';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    private usersService: UsersService,
    private cryptoService: CryptoService
  ) {}

  private toCardInterface(cardDoc: CardDocument): Card {
        const cardObj = cardDoc.toObject();
        cardObj.id = cardObj._id.toString();
        delete cardObj._id;
        delete cardObj.__v;
        delete cardObj.ccv;
        delete cardObj.number;
        return cardObj as Card;
    }

  async register(registerCardDto: RegisterCardDto, userId: string): Promise<Card> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const encryptedNumber = this.cryptoService.encrypt(registerCardDto.number);
    const encryptedCcv    = this.cryptoService.encrypt(registerCardDto.ccv);

    const cardDoc = new this.cardModel({
      ...registerCardDto,
      number: encryptedNumber,
      ccv: encryptedCcv,
      userId: new Types.ObjectId(userId),
    });
    const saved = await cardDoc.save();

    return this.toCardInterface(saved);
  }
}
