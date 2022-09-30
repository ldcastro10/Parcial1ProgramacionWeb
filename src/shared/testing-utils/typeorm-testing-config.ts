/* eslint-disable prettier/prettier */
/* archivo ../shared/testing-utils/typeorm-testing-config.ts*/
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from '../../tienda/tienda.entity';
import { CafeEntity } from '../../cafe/cafe.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [TiendaEntity,CafeEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([TiendaEntity,CafeEntity]),
];
/* archivo ../shared/testing-utils/typeorm-testing-config.ts*/