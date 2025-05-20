import {
    IsNotEmpty,
    IsNumber,
  } from 'class-validator';
  
export class CreateRechargeDto {
  @IsNotEmpty()
  @IsNumber()
  purchasedCoins: number;
}
  