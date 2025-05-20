import mongoose from 'mongoose';
import {
    ClaimDto,
    CreateGameDto,
    UpdateGameDto,
  } from '../dto/game.dto';
  
export interface Game {
    _id: mongoose.Schema.Types.ObjectId;        
    id?: string;           
    title: string;
    description: string;
    gender: string[];
    price: number;
    creatorId: mongoose.Schema.Types.ObjectId;
    earnings?: number;
    downloads?: number;
    release?: Date;
}

export interface GameServiceInterface {
    create(createGameDto: CreateGameDto, creatorId: string): Promise<Game>;
    update(updateGameDto: UpdateGameDto, gameId: string, userId: string): Promise<Game>;
    incrementDownloadsAndEarnings(gameId: string, amount: number): Promise<void>;
    findById(gameId: string): Promise<Game>;
    claim(userId: string, claimDto: ClaimDto): Promise<void>;
}
