import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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
