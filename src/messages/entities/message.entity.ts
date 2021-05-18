import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn, OneToOne } from "typeorm";
import { Exclude } from 'class-transformer';
import { User } from "src/users/entities/user.entity";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    
    @ManyToOne(() => User, (user: User) => user.messagesSent, {
        eager: true,
    })
    @JoinColumn({ name: "from" })
    from: User;

    @ManyToOne(() => User, (user: User) => user.messagesReceived, {
        eager: true,
    })
    @JoinColumn({ name: "to" })
    to: User;

    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false })
    message: string;

    @Column({ default: false })
    hasRead: boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;

    @Exclude()
    @Column({ default: false })
    deleted: boolean;

    @OneToOne(() => Message)
    @JoinColumn({ name: 'reply'})
    reply: Message;

    @OneToOne(() => Message)
    @JoinColumn({ name: 'parent_message'})
    parentMessage: Message;

    // @DeleteDateColumn()
    // deletedAt?: Date;
}
