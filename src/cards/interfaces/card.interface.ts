import mongoose from 'mongoose';
import {
    RegisterCardDto
  } from '../dto/card.dto';
  
export interface Card {
    _id: mongoose.Schema.Types.ObjectId;        
    id?: string;           
    type: string;
    number: string;
    ccv: string;
    expirationDate: Date;
    userId: mongoose.Schema.Types.ObjectId;
}

export interface CardServiceInterface {
    register(registerCardDto: RegisterCardDto, userId: string): Promise<Card>;
    findByOne(CardId: string): Promise<Card>;
}
