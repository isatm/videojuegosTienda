import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsDate,
    IsOptional,
    IsArray,
    IsEnum,
    Length,
    Matches,
    IsCreditCard,
    IsDateString,
  } from 'class-validator';
import { CardType } from '../schema/card.schema';
  
export class RegisterCardDto {
    @IsEnum(CardType, { each: true })
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsCreditCard()
    number: string;

    @IsNotEmpty()
    @Length(3, 4)
    @Matches(/^[0-9]+$/, { message: 'Incorrect Format to CCV' })
    ccv: string;

    @IsNotEmpty()
    @IsDateString()
    expirationDate: Date;
}
