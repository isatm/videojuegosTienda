import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsDate,
    IsOptional,
    IsArray,
  } from 'class-validator';
  
export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  gender: string[];
  
  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsDate()
  release: Date;
}
  