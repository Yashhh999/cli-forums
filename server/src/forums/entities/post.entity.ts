import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/user.schema";
import { Channel } from "./channel.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: false })
    isResolved: boolean;

    @ManyToOne(() => User, user => user.posts)
    author: User;

    @ManyToOne(() => Channel, channel => channel.posts)
    channel: Channel;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];
}