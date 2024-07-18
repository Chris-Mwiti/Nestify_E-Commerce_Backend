import { Product, ProductStockStatus } from "src/products/entities/product.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
import { Column, Entity, OneToOne, PrimaryColumn, Relation } from "typeorm";

export enum InventoryStatus {
    IN_STOCK = "in_stock",
    OUT_OF_STOCK = "out_of_stock",
    PENDING_STOCK = "pending_stock"
}

@Entity()
export class Inventory extends TimeStamp{
    @PrimaryColumn()
    inventoryId:string;

    @Column()
    quantity:number;

    @Column({
        type: "enum",
        enum: InventoryStatus,
        default: InventoryStatus.IN_STOCK
    })
    stockStatus:ProductStockStatus

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    lastRefilDate: Date

    /**@relations */
    @OneToOne((type) => Product, (product) => product.inventory, {onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    product:Relation<Product>
}


