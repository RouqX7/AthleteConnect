export type Event = {
    id: string;
    organizerId: string;  // References `Profile.user.authInfo.uid`
    organizerType: "player" | "club";
    name: string;
    description: string;
    date: Date;
    location: string;
    attendees: string[]; // List of player UIDs attending
    createdAt: Date;
    updatedAt: Date;
}