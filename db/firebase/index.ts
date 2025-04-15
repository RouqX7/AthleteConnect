import { ICommentDB } from "../interfaces/ICommentDB";
import CommentDB from "./commentDB";
import { IDB } from "../interfaces";

export default class FirebaseDB implements IDB {
    commentDB: ICommentDB = new CommentDB();
}