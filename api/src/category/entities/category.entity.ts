import { Collection } from "src/collections/entities/collection.entity";
import { Product } from "src/products/entities/product.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
import { Column, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, Relation, Tree, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("adjacency-list")
export class Category extends TimeStamp {
    @PrimaryColumn()
    categoryId:string;

    @Column({
        unique: true
    })
    categoryName:string;

    @Column()
    categoryDescription:string;

    @TreeParent()
    parent:Category

    @TreeChildren()
    children:Category[]

    @DeleteDateColumn()
    deletedAt:Date

    /**
     * @relation
     */
    @OneToMany((type) => Product, (product) => product.category)
    product:Relation<Product[]>
    @ManyToMany((type) => Collection, (collection) => collection.categories)
    collections:Relation<Collection[]>
}
