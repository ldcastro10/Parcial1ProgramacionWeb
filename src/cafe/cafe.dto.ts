/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator";

export class CafeDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
 
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    readonly precio: number;

}
