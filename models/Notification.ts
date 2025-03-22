export type Notification = {
    id: string;
    recipientId: string; // Who gets the notification
    type: "follow" | "comment" | "event_invite";
    relatedId: string; // Post, event, or user
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
};
