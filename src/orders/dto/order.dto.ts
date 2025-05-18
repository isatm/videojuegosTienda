import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  gameId: string;
}
