import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CardDocument = Card & Document;

export enum CardType {
  Credit = 'Credito',
  Debit = 'Debito' 
}

@Schema()
export class Card {
  @Prop({ 
      required: true,
      type: [String],
      enum: Object.values(CardType)}) 
  type: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  ccv: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({
  type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, })
  userId: mongoose.Schema.Types.ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
