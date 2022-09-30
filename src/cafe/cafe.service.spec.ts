/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CafeEntity } from './cafe.entity';
import { CafeService } from './cafe.service';

import { faker } from '@faker-js/faker';

describe('CafeService', () => {
  let service: CafeService;
  let repository: Repository<CafeEntity>;
  let cafesList: CafeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CafeService],
    }).compile();

    service = module.get<CafeService>(CafeService);
    repository = module.get<Repository<CafeEntity>>(getRepositoryToken(CafeEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    cafesList = [];
    for(let i = 0; i < 5; i++){
        const cafe: CafeEntity = await repository.save({
          nombre: faker.lorem.sentence(),
          descripcion: faker.lorem.sentence(),
          precio: Math.floor(Math.random() * 1000)
      })
        cafesList.push(cafe);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cafes', async () => {
    const cafes: CafeEntity[] = await service.findAll();
    expect(cafes).not.toBeNull();
    expect(cafes).toHaveLength(cafesList.length);
  });

  it('findOne should return a cafe by id', async () => {
    const storedCafe: CafeEntity = cafesList[0];
    const cafe: CafeEntity = await service.findOne(storedCafe.id);
    expect(cafe).not.toBeNull();
    expect(cafe.nombre).toEqual(storedCafe.nombre)
    expect(cafe.descripcion).toEqual(storedCafe.descripcion)
    expect(cafe.precio).toEqual(storedCafe.precio)
  });

  it('findOne should throw an exception for an invalid cafe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The cafe with the given id was not found")
  });

  it('create should return a new cafe', async () => {
    const cafe: CafeEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000),
      tiendas: []
    }

    const newCafe: CafeEntity = await service.create(cafe);
    expect(newCafe).not.toBeNull();

    const storedCafe: CafeEntity = await repository.findOne({where: {id: newCafe.id}})
    expect(storedCafe).not.toBeNull();
    expect(cafe.nombre).toEqual(storedCafe.nombre)
    expect(cafe.descripcion).toEqual(storedCafe.descripcion)
    expect(cafe.precio).toEqual(storedCafe.precio)
  });

  it('price of coffee must be positive', async () => {
    const cafe: CafeEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: -10,
      tiendas: []
    }

    await expect(() => service.create(cafe)).rejects.toHaveProperty("message", "The coffee has a negative price")

  });

  it('price of coffee must be positive2', async () => {
    const cafe: CafeEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000),
      tiendas: []
    }

    const newCafe: CafeEntity = await service.create(cafe);
    expect(newCafe).not.toBeNull();

    const storedCafe: CafeEntity = await repository.findOne({where: {id: newCafe.id}})
    expect(cafe.precio).toBeGreaterThan(0)
    expect(storedCafe.precio).toBeGreaterThan(0)
  });
  

  it('update should modify a cafe', async () => {
    const cafe: CafeEntity = cafesList[0];
    cafe.nombre = "New name";
    cafe.descripcion = "New descripcion";
  
    const updatedCafe: CafeEntity = await service.update(cafe.id, cafe);
    expect(updatedCafe).not.toBeNull();
  
    const storedCafe: CafeEntity = await repository.findOne({ where: { id: cafe.id } })
    expect(storedCafe).not.toBeNull();
    expect(storedCafe.nombre).toEqual(cafe.nombre)
    expect(storedCafe.descripcion).toEqual(cafe.descripcion)
  });
 
  it('update should throw an exception for an invalid cafe', async () => {
    let cafe: CafeEntity = cafesList[0];
    cafe = {
      ...cafe, nombre: "New name", descripcion: "New descripcion"
    }
    await expect(() => service.update("0", cafe)).rejects.toHaveProperty("message", "The cafe with the given id was not found")
  });

  it('delete should remove a cafe', async () => {
    const cafe: CafeEntity = cafesList[0];
    await service.delete(cafe.id);
  
    const deletedCafe: CafeEntity = await repository.findOne({ where: { id: cafe.id } })
    expect(deletedCafe).toBeNull();
  });

  it('delete should throw an exception for an invalid cafe', async () => {
    const cafe: CafeEntity = cafesList[0];
    await service.delete(cafe.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The cafe with the given id was not found")
  });
 
});
