import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

export abstract class TimeStamp {
    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date
}

