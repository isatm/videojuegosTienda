import mongoose from 'mongoose';
import { CreateOrderDto } from '../dto/order.dto';
  
export interface Order {
    _id: mongoose.Schema.Types.ObjectId;    
    id?: string;           
    userId: mongoose.Schema.Types.ObjectId;
    gameId: mongoose.Schema.Types.ObjectId;
    price: number;
    purchasedAt: Date;
}

export interface OrderServiceInterface {
    create(userId: string, createOrderDto: CreateOrderDto): Promise<Order>;
}
