/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CafeEntity } from '../cafe/cafe.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TiendaCafeService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>,
     
        @InjectRepository(CafeEntity)
        private readonly cafeRepository: Repository<CafeEntity>
    ) {}

    async addCafeTienda(tiendaId: string, cafeId: string): Promise<TiendaEntity> {
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}});
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND);
       
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["cafes"]}) 
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND);
     
        tienda.cafes = [...tienda.cafes, cafe];
        return await this.tiendaRepository.save(tienda);
      }
     
    async findCafeByTiendaIdCafeId(tiendaId: string, cafeId: string): Promise<CafeEntity> {
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}});
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND)
        
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["cafes"]}); 
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
    
        const tiendaCafe: CafeEntity = tienda.cafes.find(e => e.id === cafe.id);
    
        if (!tiendaCafe)
          throw new BusinessLogicException("The cafe with the given id is not associated to the tienda", BusinessError.PRECONDITION_FAILED)
    
        return tiendaCafe;
    }
     
    async findCafesByTiendaId(tiendaId: string): Promise<CafeEntity[]> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["cafes"]});
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
        
        return tienda.cafes;
    }
     
    async associateCafesTienda(tiendaId: string, cafes: CafeEntity[]): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["cafes"]});
     
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < cafes.length; i++) {
          const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafes[i].id}});
          if (!cafe)
            throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        tienda.cafes = cafes;
        return await this.tiendaRepository.save(tienda);
      }
     
    async deleteCafeTienda(tiendaId: string, cafeId: string){
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id: cafeId}});
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND)
     
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["cafes"]});
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
     
        const tiendaCafe: CafeEntity = tienda.cafes.find(e => e.id === cafe.id);
     
        if (!tiendaCafe)
            throw new BusinessLogicException("The cafe with the given id is not associated to the tienda", BusinessError.PRECONDITION_FAILED)

        tienda.cafes = tienda.cafes.filter(e => e.id !== cafeId);
        await this.tiendaRepository.save(tienda);
    }   
}
