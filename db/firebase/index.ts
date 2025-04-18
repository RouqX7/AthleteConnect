import { ICommentDB } from "../interfaces/ICommentDB";
import CommentDB from "./commentDB";
import { IDB } from "../interfaces";
import { IEvent } from "../interfaces/IEvent";
import EventDb from "./eventDB";
import { IPostDB } from "../interfaces/IPostDB";
import PostDB from "./postDB";
export default class FirebaseDB implements IDB {
    commentDB: ICommentDB = new CommentDB();
    eventDB: IEvent = new EventDb();
    postDB: IPostDB = new PostDB();
}