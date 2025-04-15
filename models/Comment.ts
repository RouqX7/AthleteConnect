export type Comment = {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    likes: number;
    replyCount: number;
    createdAt: Date;
    updatedAt?: Date;
}