import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { Post } from "../forums/entities/post.entity";
import { Comment } from "../forums/entities/comment.entity";

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
}

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({ unique: true })
    username:string;

    @Column()
    password:string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Post, post => post.author)
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.author)
    comments: Comment[];
}