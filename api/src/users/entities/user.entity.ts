import { Order } from "src/orders/entities/order.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
import { DateTransformer } from "src/utils/transformers/date-timestamp.transformers";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

export enum UserStatus {
  active = "active",
  banned = "banned",
  pending = "pending",
  inactive = "inactive",
}

export enum UserRole {
    admin = "admin",
    user = "user"
}
type TEmailAddresses = {
    email_address:string,
    id: string,
    linked_to: any[],
    verification: {
        status: string,
        strategy: string
    }
}
@Entity()
export class User {
    @PrimaryColumn() 
    id: string;
    
    @Column()
    first_name:string;
    @Column()
    last_name: string;

    @Column({
        type: "simple-json"
    })
    email_addresses:Array<TEmailAddresses>

    @Column({
        type: "date",
        transformer: new DateTransformer()
    })
    created_at: Date

    @Column({
        type: "date",
        transformer: new DateTransformer()
    }) 
    updated_at: Date
    
    @Column({
        type: "date",
        transformer: new DateTransformer()
    }) 
    last_sign_in_at: Date

    @OneToMany((type) => Order, (order) => order.user, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE"})
    orders?:Order[]
    
}    