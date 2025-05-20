import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from 'mongoose';

export type reviewDocument = Review & Document


@Schema({ timestamps: true })
export class Review {

    @Prop({ required: true })
    score: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true })
    gameId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    comment: string;
/*
    @Prop({ type: Date })
    review_date: Date
*/
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    authorId: mongoose.Schema.Types.ObjectId;

}

export const ReviewSchema = SchemaFactory.createForClass(Review);