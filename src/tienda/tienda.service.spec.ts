/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';

import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await repository.save({
          nombre: faker.lorem.sentence(),
          direccion: faker.lorem.sentence(),
          telefono: Math.random().toString(36).substring(2,12)
      })
        tiendasList.push(tienda);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne should return a tienda by id', async () => {
    const storedTienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre)
    expect(tienda.direccion).toEqual(storedTienda.direccion)
    expect(tienda.telefono).toEqual(storedTienda.telefono)
  });

  it('findOne should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The tienda with the given id was not found")
  });

  it('create should return a new tienda', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12),
      cafes: []
    }

    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();

    const storedTienda: TiendaEntity = await repository.findOne({where: {id: newTienda.id}})
    expect(storedTienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre)
    expect(tienda.direccion).toEqual(storedTienda.direccion)
    expect(tienda.telefono).toEqual(storedTienda.telefono)
  });

  it('must have a valid phone', async () => {
    const tienda: TiendaEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: "0110",
      cafes: []
    }

    await expect(() => service.create(tienda)).rejects.toHaveProperty("message", "telefono erroneo")
  });

  it('update should modify a tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.nombre = "New name";
    tienda.direccion = "New direccion";
  
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
  
    const storedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre)
    expect(storedTienda.direccion).toEqual(tienda.direccion)
  });
 
  it('update should throw an exception for an invalid tienda', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda, nombre: "New name", direccion: "New direccion"
    }
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "The tienda with the given id was not found")
  });

  it('delete should remove a tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
  
    const deletedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(deletedTienda).toBeNull();
  });

  it('delete should throw an exception for an invalid tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The tienda with the given id was not found")
  });
 
});
