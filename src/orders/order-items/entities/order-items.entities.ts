import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, Relation } from "typeorm";

@Entity()
export default class OrderItems extends TimeStamp {

    @PrimaryColumn()
    itemId:string;

    @Column()
    quantity:number;

    @Column()
    price:number;

    /**@relations */
    @ManyToOne(type => Order, (order) => order.items)
    order:Relation<Order>

    @ManyToOne(type => Product, (product) => product.items)
    product:Relation<Product>

}