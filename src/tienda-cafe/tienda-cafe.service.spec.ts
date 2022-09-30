/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CafeEntity } from '../cafe/cafe.entity';
import { Repository } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaCafeService } from './tienda-cafe.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TiendaCafeService', () => {
  let service: TiendaCafeService;
  let tiendaRepository: Repository<TiendaEntity>;
  let cafeRepository: Repository<CafeEntity>;
  let tienda: TiendaEntity;
  let cafesList : CafeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaCafeService],
    }).compile();

    service = module.get<TiendaCafeService>(TiendaCafeService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    cafeRepository = module.get<Repository<CafeEntity>>(getRepositoryToken(CafeEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    cafeRepository.clear();
    tiendaRepository.clear();

    cafesList = [];
    for(let i = 0; i < 5; i++){
        const cafe: CafeEntity = await cafeRepository.save({
          nombre: faker.lorem.sentence(),
          descripcion: faker.lorem.sentence(),
          precio: Math.floor(Math.random() * 1000)
        })
        cafesList.push(cafe);
    }

    tienda = await tiendaRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12),
      cafes: cafesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCafeTienda should add an cafe to a tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000)
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12)
    })

    const result: TiendaEntity = await service.addCafeTienda(newTienda.id, newCafe.id);
    
    expect(result.cafes.length).toBe(1);
    expect(result.cafes[0]).not.toBeNull();
    expect(result.cafes[0].nombre).toBe(newCafe.nombre)
    expect(result.cafes[0].descripcion).toBe(newCafe.descripcion)
    expect(result.cafes[0].precio).toBe(newCafe.precio)
  });

  it('addCafeTienda should thrown exception for an invalid cafe', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.lorem.sentence(),
      direccion: faker.lorem.sentence(),
      telefono: Math.random().toString(36).substring(2,12)
    })

    await expect(() => service.addCafeTienda(newTienda.id, "0")).rejects.toHaveProperty("message", "The cafe with the given id was not found");
  });

  it('addCafeTienda should throw an exception for an invalid tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000)
    });

    await expect(() => service.addCafeTienda("0", newCafe.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });

  it('findCafeByTiendaIdCafeId should return cafe by tienda', async () => {
    const cafe: CafeEntity = cafesList[0];
    const storedCafe: CafeEntity = await service.findCafeByTiendaIdCafeId(tienda.id, cafe.id, )
    expect(storedCafe).not.toBeNull();
    expect(storedCafe.nombre).toBe(cafe.nombre);
    expect(storedCafe.descripcion).toBe(cafe.descripcion);
    expect(storedCafe.precio).toBe(cafe.precio);
  });

  it('findCafeByTiendaIdCafeId should throw an exception for an invalid cafe', async () => {
    await expect(()=> service.findCafeByTiendaIdCafeId(tienda.id, "0")).rejects.toHaveProperty("message", "The cafe with the given id was not found"); 
  });

  it('findCafeByTiendaIdCafeId should throw an exception for an invalid tienda', async () => {
    const cafe: CafeEntity = cafesList[0]; 
    await expect(()=> service.findCafeByTiendaIdCafeId("0", cafe.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('findCafeByTiendaIdCafeId should throw an exception for an cafe not associated to the tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000)
    });

    await expect(()=> service.findCafeByTiendaIdCafeId(tienda.id, newCafe.id)).rejects.toHaveProperty("message", "The cafe with the given id is not associated to the tienda"); 
  });

  it('findCafesByTiendaId should return cafes by tienda', async ()=>{
    const cafes: CafeEntity[] = await service.findCafesByTiendaId(tienda.id);
    expect(cafes.length).toBe(5)
  });

  it('findCafesByTiendaId should throw an exception for an invalid tienda', async () => {
    await expect(()=> service.findCafesByTiendaId("0")).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('associateCafesTienda should update cafes list for a tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000)
    });

    const updatedTienda: TiendaEntity = await service.associateCafesTienda(tienda.id, [newCafe]);
    expect(updatedTienda.cafes.length).toBe(1);

    expect(updatedTienda.cafes[0].nombre).toBe(newCafe.nombre);
    expect(updatedTienda.cafes[0].descripcion).toBe(newCafe.descripcion);
    expect(updatedTienda.cafes[0].precio).toBe(newCafe.precio);
  });

  it('associateCafesTienda should throw an exception for an invalid tienda', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000)
    });

    await expect(()=> service.associateCafesTienda("0", [newCafe])).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('associateCafesTienda should throw an exception for an invalid cafe', async () => {
    const newCafe: CafeEntity = cafesList[0];
    newCafe.id = "0";

    await expect(()=> service.associateCafesTienda(tienda.id, [newCafe])).rejects.toHaveProperty("message", "The cafe with the given id was not found"); 
  });

  it('deleteCafeToTienda should remove an cafe from a tienda', async () => {
    const cafe: CafeEntity = cafesList[0];
    
    await service.deleteCafeTienda(tienda.id, cafe.id);

    const storedTienda: TiendaEntity = await tiendaRepository.findOne({where: {id: tienda.id}, relations: ["cafes"]});
    const deletedCafe: CafeEntity = storedTienda.cafes.find(a => a.id === cafe.id);

    expect(deletedCafe).toBeUndefined();

  });

  it('deleteCafeToTienda should thrown an exception for an invalid cafe', async () => {
    await expect(()=> service.deleteCafeTienda(tienda.id, "0")).rejects.toHaveProperty("message", "The cafe with the given id was not found"); 
  });

  it('deleteCafeToTienda should thrown an exception for an invalid tienda', async () => {
    const cafe: CafeEntity = cafesList[0];
    await expect(()=> service.deleteCafeTienda("0", cafe.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteCafeToTienda should thrown an exception for an non asocciated cafe', async () => {
    const newCafe: CafeEntity = await cafeRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.sentence(),
      precio: Math.floor(Math.random() * 1000)
    });

    await expect(()=> service.deleteCafeTienda(tienda.id, newCafe.id)).rejects.toHaveProperty("message", "The cafe with the given id is not associated to the tienda"); 
  }); 

});
