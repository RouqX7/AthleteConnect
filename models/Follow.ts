export type Follow = {
    id: string;
    followerId: string; // User who follows
    followingId: string; // User being followed
    createdAt: Date;
};