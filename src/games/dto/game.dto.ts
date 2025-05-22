import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsDate,
    IsOptional,
    IsArray,
    IsEnum,
    IsDateString,
    IsMongoId,
  } from 'class-validator';
import { GameGender } from '../schema/game.schema';
  
export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(GameGender, { each: true })
  @IsArray()
  gender?: GameGender[];
  
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsDateString()
  release?: Date;
}

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GameGender, { each: true })
  @IsArray()
  gender?: GameGender[];

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsDate()
  release?: Date;
}