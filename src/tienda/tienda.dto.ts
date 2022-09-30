/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsUrl, IsDateString} from 'class-validator';
export class TiendaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
  
  @IsString()
  @IsNotEmpty()
  readonly direccion: string;
  
  @IsString()
  @IsNotEmpty()
  readonly telefono: string;

}
