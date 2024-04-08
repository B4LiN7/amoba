import { IsNotEmpty, IsNumber } from 'class-validator';

export class PlayDto {
  @IsNotEmpty()
  @IsNumber()
  x: number;

  @IsNotEmpty()
  @IsNumber()
  y: number;
}
