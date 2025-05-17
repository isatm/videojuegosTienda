import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }] })
  gamesPublished: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: String, required: false })
  refreshToken?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, required: false })
  verificationCode?: string;

  @Prop({ type: Date, required: false })
  verificationCodeExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);