/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CafeDto } from './cafe.dto';
import { CafeEntity } from './cafe.entity';
import { CafeService } from './cafe.service';

@Controller('cafes')
@UseInterceptors(BusinessErrorsInterceptor)
export class CafeController {
    constructor(private readonly cafeService: CafeService) {}

  @Get()
  async findAll() {
    return await this.cafeService.findAll();
  }

  @Get(':cafeId') 
  async findOne(@Param('cafeId') cafeId: string) {
    return await this.cafeService.findOne(cafeId);
  }

  @Post()
  async create(@Body() cafeDto: CafeDto) {
    const cafe = plainToInstance(CafeEntity, cafeDto);
    return await this.cafeService.create(cafe);
  }

  @Put(':cafeId')
  async update(@Param('cafeId') cafeId: string, @Body() cafeDto: CafeDto) {
    const cafe = plainToInstance(CafeEntity, cafeDto);
    return await this.cafeService.update(cafeId, cafe);
  }

  @Delete(':cafeId')
  @HttpCode(204)
  async delete(@Param('cafeId') cafeId: string) {
    return await this.cafeService.delete(cafeId);
  }

}
