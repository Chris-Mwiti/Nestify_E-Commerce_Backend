import { Category } from 'src/category/entities/category.entity';
import { TimeStamp } from 'src/utils/entities/timestamp.entities';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { DateTransformer } from './transformers/date.transfomer';

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
  productBarCode: number;

  /**
   * @relations
   */

  @ManyToOne((type) => Category, (category) => category.product)
  category: Relation<Category>;
}
