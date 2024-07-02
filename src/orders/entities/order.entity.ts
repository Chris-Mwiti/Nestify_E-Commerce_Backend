import { User } from "src/users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, Relation } from "typeorm";
import OrderItems from "../order-items/entities/order-items.entities";
import { Payment } from "src/payment/entities/payment.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
import { Shipping } from "src/shipping/entities/shipping.entity";

export enum OrderStatus {
    pending = "pending",
    completed = "completed",
    refunded = "refunded",
    cancelled = "cancelled"
}

@Entity()
export class Order extends TimeStamp {

    @PrimaryColumn()
    orderId:string;

    @Column()
    total:number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.pending
    })
    status:OrderStatus

    @DeleteDateColumn()
    deletedAt:Date

    /**@relations */
    @OneToMany((type) => OrderItems, (orderItems) => orderItems.order, {onDelete: "CASCADE", onUpdate: "CASCADE"})
    items:Relation<OrderItems[]>

    @ManyToOne((type) => User, (user) => user.orders, { nullable: true })
    user?:Relation<User>

    @OneToOne((type) => Payment, (payment) => payment.order, {onUpdate: "CASCADE", onDelete: 'CASCADE'})
    payment:Relation<Payment>

    @OneToMany((type) => Shipping, (shipping) => shipping.order, {onUpdate: "CASCADE", onDelete: "CASCADE"})
    shipping: Relation<Shipping[]>
} 
