/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { CafeEntity } from '../cafe/cafe.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CafeTiendaService {
    constructor(
        @InjectRepository(CafeEntity)
        private readonly cafeRepository: Repository<CafeEntity>,
     
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ) {}

    async addTiendaCafe(cafeId: string, tiendaId: string): Promise<CafeEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND);
       
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}, relations: ["tiendas"]}) 
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND);
     
        cafe.tiendas = [...cafe.tiendas, tienda];
        return await this.cafeRepository.save(cafe);
      }
     
    async findTiendaByCafeIdTiendaId(cafeId: string, tiendaId: string): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
        
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}, relations: ["tiendas"]}); 
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND)
    
        const cafeTienda: TiendaEntity = cafe.tiendas.find(e => e.id === tienda.id);
    
        if (!cafeTienda)
          throw new BusinessLogicException("The tienda with the given id is not associated to the cafe", BusinessError.PRECONDITION_FAILED)
    
        return cafeTienda;
    }
     
    async findTiendasByCafeId(cafeId: string): Promise<TiendaEntity[]> {
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}, relations: ["tiendas"]});
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND)
        
        return cafe.tiendas;
    }
     
    async associateTiendasCafe(cafeId: string, tiendas: TiendaEntity[]): Promise<CafeEntity> {
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}, relations: ["tiendas"]});
     
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < tiendas.length; i++) {
          const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendas[i].id}});
          if (!tienda)
            throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        cafe.tiendas = tiendas;
        return await this.cafeRepository.save(cafe);
      }
     
    async deleteTiendaCafe(cafeId: string, tiendaId: string){
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
     
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}, relations: ["tiendas"]});
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND)
     
        const cafeTienda: TiendaEntity = cafe.tiendas.find(e => e.id === tienda.id);
     
        if (!cafeTienda)
            throw new BusinessLogicException("The tienda with the given id is not associated to the cafe", BusinessError.PRECONDITION_FAILED)

        cafe.tiendas = cafe.tiendas.filter(e => e.id !== tiendaId);
        await this.cafeRepository.save(cafe);
    }   
}
