export type Post = {
    id: string;	
    authorId: string;  // References `Profile.user.authInfo.uid`
    authorType: "player" | "club";
    content: string;
    images?: string[];  // Optional image attachments
    videos?: string[];  // Optional video attachments
    likes: number;
    comments: number;
    createdAt: Date;
};