import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../../users/user.schema";
import { Post } from "./post.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    isAiGenerated: boolean;

    @Column({ default: false })
    isAccepted: boolean;

    @ManyToOne(() => User, user => user.comments)
    author: User;

    @ManyToOne(() => Post, post => post.comments)
    post: Post;
}
