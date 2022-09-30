/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CafeEntity } from './cafe.entity';

@Injectable()
export class CafeService {
    constructor(
        @InjectRepository(CafeEntity)
        private readonly cafeRepository: Repository<CafeEntity>
    ){}

    async findAll(): Promise<CafeEntity[]> {
        return await this.cafeRepository.find({ relations: ["tiendas"] });
    }

    async findOne(id: string): Promise<CafeEntity> {
        const cafe: CafeEntity = await this.cafeRepository.findOne({where: {id}, relations: ["tiendas"] } );
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND);
    
        return cafe;
    }
    
    async create(cafe: CafeEntity): Promise<CafeEntity> {
        if (cafe.precio < 0)
        throw new BusinessLogicException("The coffee has a negative price", BusinessError.NEGATIVE_PRICE);

        return await this.cafeRepository.save(cafe);
    }

    async update(id: string, cafe: CafeEntity): Promise<CafeEntity> {
        const persistedCafe: CafeEntity = await this.cafeRepository.findOne({where:{id}});
        if (!persistedCafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND);
     
        return await this.cafeRepository.save({...persistedCafe, ...cafe});
    }

    async delete(id: string) {
        const cafe: CafeEntity = await this.cafeRepository.findOne({where:{id}});
        if (!cafe)
          throw new BusinessLogicException("The cafe with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.cafeRepository.remove(cafe);
    }
}
