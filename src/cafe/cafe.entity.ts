/* eslint-disable prettier/prettier */
import { TiendaEntity } from '../tienda/tienda.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CafeEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;

 @Column()
 descripcion: string;
 
 @Column()
 precio: number;

@ManyToMany(() => TiendaEntity, tienda => tienda.cafes)
tiendas: TiendaEntity[];  

}