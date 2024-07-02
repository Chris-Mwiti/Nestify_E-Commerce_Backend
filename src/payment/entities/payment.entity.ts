import { Order } from "src/orders/entities/order.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

export enum PaymentType {
    MPESA = "M_PESA",
    CASH = "CASH"
}

@Entity()
export class Payment extends TimeStamp {

    @PrimaryColumn()
    paymentId:string;

    @Column()
    amount:number;

    @Column({
        type: "enum",
        enum: PaymentType,
        default: PaymentType.CASH
    })
    paymentType:PaymentType

    @DeleteDateColumn()
    deletedAt:Date

    /**@relations */
    @OneToOne((type) => Order, (order) => order.payment)
    @JoinColumn()
    order:Order

}
