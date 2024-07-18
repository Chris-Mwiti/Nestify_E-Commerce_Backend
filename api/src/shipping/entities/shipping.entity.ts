import { Order } from "src/orders/entities/order.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryColumn } from "typeorm";

export enum ShippingStatus {
    pending = "pending",
    completed = "compelted",
    cancelled = "cancelled"
}

@Entity()
export class Shipping extends TimeStamp {

    @PrimaryColumn()
    shippingId:string;

    @Column()
    county:string;

    @Column()
    street:string;

    @Column()
    town:string;

    @Column()
    locationDesc:string

    @Column({
        type: "enum",
        enum: ShippingStatus,
        default: ShippingStatus.pending
    })
    status:ShippingStatus

    @DeleteDateColumn()
    deletedAt:Date

    /**@relations */
    @ManyToOne(type => Order, (order) => order.shipping, {cascade: true})
    order:Order
}