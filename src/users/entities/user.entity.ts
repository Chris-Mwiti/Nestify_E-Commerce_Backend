import { Order } from "src/orders/entities/order.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
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

@Entity()
export class User extends TimeStamp{
    @PrimaryColumn() 
    userId:string

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column({
        unique: true
    })
    email:string;

    @Column({
        nullable: true
    })
    password:string;

    @Column({
        nullable: true
    })
    avatarUrl:string

    @Column({
        nullable: true
    })
    googleId:string;

    @Column({
        nullable: true
    })
    profileUrl:string;

    @Column({
        unique: true
    })
    phone:string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.user,
    })
    role: UserRole

    @Column({
        default: UserStatus.active
    })
    status: UserStatus

    @DeleteDateColumn()
    deletedAt:Date

    /**@relations */
    @OneToMany(type => Order, (order) => order.user, {nullable: true, cascade: true})
    orders?:Order[]
}

type TUser = typeof User

export { 
    TUser
}


