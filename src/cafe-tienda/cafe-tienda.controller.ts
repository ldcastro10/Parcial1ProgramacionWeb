/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { TiendaDto } from '../tienda/tienda.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CafeTiendaService } from './cafe-tienda.service';

@Controller('cafes')
@UseInterceptors(BusinessErrorsInterceptor)
export class CafeTiendaController {
    constructor(private readonly cafeTiendaService: CafeTiendaService){}

    @Post(':cafeId/tiendas/:tiendaId')
    async addTiendaCafe(@Param('cafeId') cafeId: string, @Param('tiendaId') tiendaId: string){
        return await this.cafeTiendaService.addTiendaCafe(cafeId, tiendaId);
    }

    @Get(':cafeId/tiendas/:tiendaId')
    async findTiendaByCafeIdTiendaId(@Param('cafeId') cafeId: string, @Param('tiendaId') tiendaId: string){
        return await this.cafeTiendaService.findTiendaByCafeIdTiendaId(cafeId, tiendaId);
    }

    @Get(':cafeId/tiendas')
    async findTiendasByCafeId(@Param('cafeId') cafeId: string){
        return await this.cafeTiendaService.findTiendasByCafeId(cafeId);
    }

    @Put(':cafeId/tiendas')
    async associateTiendasCafe(@Body() tiendasDto: TiendaDto[], @Param('cafeId') cafeId: string){
        const tiendas = plainToInstance(TiendaEntity, tiendasDto)
        return await this.cafeTiendaService.associateTiendasCafe(cafeId, tiendas);
    }
    
    @Delete(':cafeId/tiendas/:tiendaId')
    @HttpCode(204)
    async deleteTiendaCafe(@Param('cafeId') cafeId: string, @Param('tiendaId') tiendaId: string){
        return await this.cafeTiendaService.deleteTiendaCafe(cafeId, tiendaId);
    }
}
