/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CafeEntity } from '../cafe/cafe.entity';

@Entity()
export class TiendaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    nombre: string;
    
    @Column()
    direccion: string;
   
    @Column()
    telefono: string;

    @ManyToMany(() => CafeEntity, cafe => cafe.tiendas)
    @JoinTable()
    cafes: CafeEntity[]

   }
