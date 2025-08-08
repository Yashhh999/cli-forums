import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Post, post => post.channel)
    posts: Post[];
}
