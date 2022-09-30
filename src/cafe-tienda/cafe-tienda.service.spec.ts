/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { CafeEntity } from '../cafe/cafe.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CafeTiendaService } from './cafe-tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CafeTiendaService', () => {
  let service: CafeTiendaService;
  let cafeRepository: Repository<CafeEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let cafe: CafeEntity;
  let tiendasList : TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CafeTiendaService],
    }).compile();

    service = module.get<CafeTiendaService>(CafeTiendaService);
    cafeRepository = module.get<Repository<CafeEntity>>(getRepositoryToken(CafeEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    cafeRepository.clear();

    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await tiendaRepository.save({
          nombre: faker.lorem.sentence(),
          direccion: faker.lorem.sentence(),
          telefono: Math.random().toString(36).substring(2,12)
        })
        tiendasList.push(tienda);
    }

    cafe = await cafeRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000),
      tiendas: tiendasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addTiendaCafe should add an tienda to a cafe', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12)
    });

    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000)
    })

    const result: CafeEntity = await service.addTiendaCafe(newCafe.id, newTienda.id);
    
    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre)
    expect(result.tiendas[0].direccion).toBe(newTienda.direccion)
    expect(result.tiendas[0].telefono).toBe(newTienda.telefono)
  });

  it('addTiendaCafe should thrown exception for an invalid tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000)
    })

    await expect(() => service.addTiendaCafe(newCafe.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });

  it('addTiendaCafe should throw an exception for an invalid cafe', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12)
    });

    await expect(() => service.addTiendaCafe("0", newTienda.id)).rejects.toHaveProperty("message", "The cafe with the given id was not found");
  });

  it('findTiendaByCafeIdTiendaId should return tienda by cafe', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const storedTienda: TiendaEntity = await service.findTiendaByCafeIdTiendaId(cafe.id, tienda.id, )
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.direccion).toBe(tienda.direccion);
    expect(storedTienda.telefono).toBe(tienda.telefono);
  });

  it('findTiendaByCafeIdTiendaId should throw an exception for an invalid tienda', async () => {
    await expect(()=> service.findTiendaByCafeIdTiendaId(cafe.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('findTiendaByCafeIdTiendaId should throw an exception for an invalid cafe', async () => {
    const tienda: TiendaEntity = tiendasList[0]; 
    await expect(()=> service.findTiendaByCafeIdTiendaId("0", tienda.id)).rejects.toHaveProperty("message", "The cafe with the given id was not found"); 
  });

  it('findTiendaByCafeIdTiendaId should throw an exception for an tienda not associated to the cafe', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12)
    });

    await expect(()=> service.findTiendaByCafeIdTiendaId(cafe.id, newTienda.id)).rejects.toHaveProperty("message", "The tienda with the given id is not associated to the cafe"); 
  });

  it('findTiendasByCafeId should return tiendas by cafe', async ()=>{
    const tiendas: TiendaEntity[] = await service.findTiendasByCafeId(cafe.id);
    expect(tiendas.length).toBe(5)
  });

  it('findTiendasByCafeId should throw an exception for an invalid cafe', async () => {
    await expect(()=> service.findTiendasByCafeId("0")).rejects.toHaveProperty("message", "The cafe with the given id was not found"); 
  });

  it('associateTiendasCafe should update tiendas list for a cafe', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12)
    });

    const updatedCafe: CafeEntity = await service.associateTiendasCafe(cafe.id, [newTienda]);
    expect(updatedCafe.tiendas.length).toBe(1);

    expect(updatedCafe.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedCafe.tiendas[0].direccion).toBe(newTienda.direccion);
    expect(updatedCafe.tiendas[0].telefono).toBe(newTienda.telefono);
  });

  it('associateTiendasCafe should throw an exception for an invalid cafe', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12)
    });

    await expect(()=> service.associateTiendasCafe("0", [newTienda])).rejects.toHaveProperty("message", "The cafe with the given id was not found"); 
  });

  it('associateTiendasCafe should throw an exception for an invalid tienda', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    newTienda.id = "0";

    await expect(()=> service.associateTiendasCafe(cafe.id, [newTienda])).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteTiendaToCafe should remove an tienda from a cafe', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    
    await service.deleteTiendaCafe(cafe.id, tienda.id);

    const storedCafe: CafeEntity = await cafeRepository.findOne({where: {id: cafe.id}, relations: ["tiendas"]});
    const deletedTienda: TiendaEntity = storedCafe.tiendas.find(a => a.id === tienda.id);

    expect(deletedTienda).toBeUndefined();

  });

  it('deleteTiendaToCafe should thrown an exception for an invalid tienda', async () => {
    await expect(()=> service.deleteTiendaCafe(cafe.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteTiendaToCafe should thrown an exception for an invalid cafe', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(()=> service.deleteTiendaCafe("0", tienda.id)).rejects.toHaveProperty("message", "The cafe with the given id was not found"); 
  });

  it('deleteTiendaToCafe should thrown an exception for an non asocciated tienda', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12)
    });

    await expect(()=> service.deleteTiendaCafe(cafe.id, newTienda.id)).rejects.toHaveProperty("message", "The tienda with the given id is not associated to the cafe"); 
  }); 

});
