import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

export enum GameGender {
  Action = 'Accion',
  Adventure = 'Aventura',
  Sports = 'Deportes',
  Strategy = 'Estrategia',
  RPG = 'RPG',
  Sandbox = 'Sandbox',
  Terror = 'Terror',
  Multiplayer = 'Multijugador',
  Other = 'Otro'
}

@Schema({ timestamps: true })
export class Game {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ 
    required: true,
    type: [String],
    enum: Object.values(GameGender) }) 
  gender: GameGender[];

  @Prop({ default: 0 })
  price: number;

  @Prop({ required: true, 
  type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creatorId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 0 })
  earnings: number;

  @Prop({ default: 0 })
  downloads: number;

  @Prop({ default: new Date()})
  release : Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);