/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CafeEntity } from 'src/cafe/cafe.entity';
import { CafeDto } from '../cafe/cafe.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaCafeService } from './tienda-cafe.service';

@Controller('tiendas')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaCafeController {
    constructor(private readonly tiendaCafeService: TiendaCafeService){}

    @Post(':tiendaId/cafes/:cafeId')
    async addCafeTienda(@Param('tiendaId') tiendaId: string, @Param('cafeId') cafeId: string){
        return await this.tiendaCafeService.addCafeTienda(tiendaId, cafeId);
    }

    @Get(':tiendaId/cafes/:cafeId')
    async findCafeByTiendaIdCafeId(@Param('tiendaId') tiendaId: string, @Param('cafeId') cafeId: string){
        return await this.tiendaCafeService.findCafeByTiendaIdCafeId(tiendaId, cafeId);
    }

    @Get(':tiendaId/cafes')
    async findCafesByTiendaId(@Param('tiendaId') tiendaId: string){
        return await this.tiendaCafeService.findCafesByTiendaId(tiendaId);
    }

    @Put(':tiendaId/cafes')
    async associateCafesTienda(@Body() cafesDto: CafeDto[], @Param('tiendaId') tiendaId: string){
        const cafes = plainToInstance(CafeEntity, cafesDto)
        return await this.tiendaCafeService.associateCafesTienda(tiendaId, cafes);
    }
    
    @Delete(':tiendaId/cafes/:cafeId')
    @HttpCode(204)
    async deleteCafeTienda(@Param('tiendaId') tiendaId: string, @Param('cafeId') cafeId: string){
        return await this.tiendaCafeService.deleteCafeTienda(tiendaId, cafeId);
    }
}
