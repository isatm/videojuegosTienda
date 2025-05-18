import { Type } from "class-transformer";
import { IsDate, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export  class CreateReviewDTO {
    @IsNotEmpty()
    @IsNumber()
    score: number;

    @IsNotEmpty()
    @IsString()
    comment: string;
/*
    @IsOptional()
    @IsDate()
    review_date: Date;
*/ 
}

export  class UpdateReviewDTO {
    @IsNumber()
    score?: number;

    @IsString()
    gameId?: string;

    @IsString()
    comment?: string;

    @IsDate()
    review_date?: Date;
}