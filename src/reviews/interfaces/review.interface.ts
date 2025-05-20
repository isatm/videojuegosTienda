import mongoose from 'mongoose';
import { CreateReviewDTO, UpdateReviewDTO } from '../dto/review.dto';
  
export interface Review {
    _id: mongoose.Schema.Types.ObjectId;        
    id?: string;           
    comment: string;
    score: number;
    gameId: mongoose.Schema.Types.ObjectId;
    authorId: mongoose.Schema.Types.ObjectId;
    //review_date?: Date
}
export interface ReviewServiceInterface {
    create(createReviewDTO: CreateReviewDTO, authorId: string, gameId: string): Promise<Review>;
    update( updateReviewDTO: UpdateReviewDTO, authorId: string): Promise<string>;
}