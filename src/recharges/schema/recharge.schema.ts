import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Card } from 'src/cards/schema/card.schema';
import { User } from 'src/users/schema/user.schema';

export type RechargeDocument = Recharge & Document;

@Schema()
export class Recharge {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true })
  cardId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  purchasedCoins: number;

  @Prop({ default: () => new Date() })
  date: Date;
}

export const RechargeSchema = SchemaFactory.createForClass(Recharge);
