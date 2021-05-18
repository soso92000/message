import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { Message } from "src/messages/entities/message.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: false, unique: true})
    email:string;

    @Column({nullable: false, unique: true})
    phone: string;

    @Exclude()
    @Column()
    password: string;

    @Exclude()
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;

    @Exclude()
    @DeleteDateColumn()
    deletedAt?: Date;

    @OneToMany(() => Message, (message: Message) => message.from, {
        eager: false,
    })
    messagesSent: Message[];

    @OneToMany(() => Message, (message: Message) => message.to, {
        eager: false,
    })
    messagesReceived: Message[];


}
