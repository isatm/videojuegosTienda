import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/user.module';
import { Card, CardSchema } from './schema/card.schema';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    UsersModule,
    CryptoModule
  ],
  providers: [CardsService],
  controllers: [CardsController]
})
export class CardsModule {}
