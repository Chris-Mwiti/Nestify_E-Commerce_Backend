  import { Category } from 'src/category/entities/category.entity';
import { TimeStamp } from 'src/utils/entities/timestamp.entities';
import {  Column, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, Relation } from 'typeorm';
import { DateTransformer } from './transformers/date.transfomer';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { ProductMetadata } from '../products-metadata/entities/product-metadata.entity';
import OrderItems from 'src/orders/order-items/entities/order-items.entities';
import { Collection } from 'src/collections/entities/collection.entity';

export enum ProductStockStatus {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  PENDING_STOCK = 'pending_stock',
}

@Entity()
export class Product extends TimeStamp {
  @PrimaryColumn()
  productId: string;

  @Column()
  productName: string;

  /**
   * @todo: update this section to true upon completion in the frontend part
   */
  @Column({
    type: 'mediumblob',
    nullable: true,
  })
  productDescription: Buffer;

  @Column()
  subDescription: string;

  @Column()
  sellingPrice: number;

  @Column()
  originalPrice: number;

  @Column()
lowLevelAlert: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isPerishable: boolean;

  @Column({
    type: 'date',
    nullable: true,
    transformer: new DateTransformer()
  })
  expireDate: Date;

  @Column({
    nullable: true,
  })
  productCode: string;

  @Column()
  productLabel: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  published: boolean;

  @Column({
    type: 'enum',
    enum: ProductStockStatus,
    default: ProductStockStatus.IN_STOCK,
  })
  stockStatus: ProductStockStatus;

  /**
   * @todo: research more about product sku's and barcodes
   */
  @Column({
    nullable: true,
  })
  productSku: string;

  @Column({
    nullable: true,
  })
  productBarCode: string;

  @DeleteDateColumn()
  deletedAt:Date

  /**
   * @relations
   */

  @ManyToOne((type) => Category, (category) => category.product)
  category: Relation<Category>;

  @OneToOne((type) => Inventory, (inventory) => inventory.product, {onUpdate: 'CASCADE', onDelete: "CASCADE"})
  @JoinColumn()
  inventory: Relation<Inventory>;

  @OneToOne(type => ProductMetadata, (productMetadata) => productMetadata.product, {onUpdate: "CASCADE", onDelete: "CASCADE"})
  @JoinColumn()
  metadata:Relation<ProductMetadata>

  @OneToMany(type => OrderItems, (orderItems) => orderItems.product, {cascade: true})
  items:Relation<OrderItems[]>

  @ManyToMany((type) => Collection, (collection) => collection.products)
  collections:Relation<Collection[]>
}
