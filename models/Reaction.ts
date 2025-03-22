export type Reaction = {
    id: string;
    postId: string;
    userId: string;
    type: "like" | "fire" | "clap";
    createdAt: Date;
    updatedAt: Date;
};

