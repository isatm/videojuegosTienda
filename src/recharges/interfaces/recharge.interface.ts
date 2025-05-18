import mongoose from 'mongoose';
import { CreateRechargeDto } from '../dto/recharge.dto';
  
export interface Recharge {
    _id: mongoose.Schema.Types.ObjectId;    
    id?: string;           
    userId: mongoose.Schema.Types.ObjectId;
    cardId: mongoose.Schema.Types.ObjectId;
    purchasedCoins: number;
    date: Date;
}

export interface RechargeServiceInterface {
    create(createRechargeDto: CreateRechargeDto, userId: string, cardId): Promise<Recharge>;
}
