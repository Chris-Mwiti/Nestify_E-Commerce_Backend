import { Category } from "src/category/entities/category.entity";
import { Product } from "src/products/entities/product.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, Relation } from "typeorm";

@Entity()
export class Collection extends TimeStamp {
    @PrimaryColumn()
    collectionId:string

    @Column()
    categoryName:string

    /**@relation */
    @ManyToMany((type) => Category, (category) => category.collections)
    @JoinTable()
    categories:Relation<Category[]>

    @ManyToMany((type) => Product, (product) => product.collections)
    @JoinTable()
    products:Relation<Product[]>

    @DeleteDateColumn()
    deletedAt:Date

}



