import { Type } from "class-transformer";
import { IsDate, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max} from "class-validator";


export  class CreateReviewDTO {
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(5)
    score: number;

    @IsNotEmpty()
    @IsString()
    comment: string;
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