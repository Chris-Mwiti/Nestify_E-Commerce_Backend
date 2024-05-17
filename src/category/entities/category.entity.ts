import { Product } from "src/products/entities/product.entity";
import { TimeStamp } from "src/utils/entities/timestamp.entities";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, Relation, Tree, TreeChildren, TreeParent } from "typeorm";

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

    /**
     * @relation
     */

    @OneToMany((type) => Product, (product) => product.category)
    product:Relation<Product[]>
}
