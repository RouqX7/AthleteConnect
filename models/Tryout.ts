export type Tryout = {
    id:string;
    playerId: string;
    clubId: string;
    status:"pending" | "accepted" | "rejected";
    appliedAt: Date;
}