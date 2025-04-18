import { ICommentDB } from "./ICommentDB";
import { IEvent } from "./IEvent";
import { IPostDB } from "./IPostDB";

export interface IDB {
    commentDB: ICommentDB;
    eventDB: IEvent
    postDB: IPostDB
}