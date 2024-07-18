import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToOne, PrimaryColumn, Relation } from "typeorm";
import { SizesMetaData } from "../dto/sizes-metadata.dto";
import SizeTransfomer from "./transformers/size.transformer";

@Entity()
export class ProductMetadata {
    @PrimaryColumn()
    metadataId:string;

    @Column({
        type: 'json',
        nullable: true,
        transformer: new SizeTransfomer()
    })
    sizes:SizesMetaData[]

    @Column({
        type: 'simple-array',
        nullable: true
    })
    colors:string[]

    @Column({
        type: 'simple-array',
        nullable: true
    })
    imageUrl:string[]


    /**@relations */
    @OneToOne(type => Product, (product) => product.metadata)
    product:Relation<Product>
}