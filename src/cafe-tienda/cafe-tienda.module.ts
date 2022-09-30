import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { CafeEntity } from '../cafe/cafe.entity';
import { CafeTiendaService } from './cafe-tienda.service';
import { CafeTiendaController } from './cafe-tienda.controller';

@Module({
  providers: [CafeTiendaService],
  imports: [TypeOrmModule.forFeature([CafeEntity, TiendaEntity])],
  controllers: [CafeTiendaController],
})
export class CafeTiendaModule {}
