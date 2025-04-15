import { DBPath } from "../../config/constants";
import { firestoreAdmin } from "../../config/firebase_config";
import { TaskComment } from "../../models/Comment";
import { ICommentDB } from "../interfaces/ICommentDB";


export default class CommentDB implements ICommentDB {
    getCommentsByTask(taskId: string): Promise<TaskComment[]> {
        return this.getCommentByField('taskId', taskId);
    }
    // getCommentsByUser(userId: string): Promise<TaskComment[]> {
    //     return this.getCommentByField('userId', userId);
    // }
    // getCommentsByContent(content: string): Promise<TaskComment[]> {
    //     return this.getCommentByField('content', content);
    // }
    
    addComment = async({comment}: { comment: TaskComment; }): Promise<string> => {
        if(!comment || !comment.id) {
            throw new Error("Comment or comment ID is missing");
        }
        try {
            await firestoreAdmin
                .collection(DBPath.comments)
                .doc(comment.id)
                .set(comment);
            return comment.id;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }

    async getAllComments(): Promise<TaskComment[]> {
        try {
            const snapshot = await firestoreAdmin.collection(DBPath.comments).get();
            return snapshot.docs.map(doc => doc.data() as TaskComment);
        } catch (error) {
            console.error('Error getting all comments:', error);
            throw error;
        }
    }

    async getComment(id: string): Promise<TaskComment> {
        try {
            const doc = await firestoreAdmin.collection(DBPath.comments).doc(id).get();
            if (!doc.exists) {
                throw new Error('Comment not found');
            }
            return doc.data() as TaskComment;
        } catch (error) {
            console.error('Error getting comment:', error);
            throw error;
        }
    }

    async updateComment(id: string, data: TaskComment): Promise<TaskComment> {
        try {
            await firestoreAdmin.collection(DBPath.comments).doc(id).update(data);
            return this.getComment(id);
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    }

    async getCommentByField(field: string, value: string): Promise<TaskComment[]> {
        try {
            const snapshot = await firestoreAdmin
                .collection(DBPath.comments)
                .where(field, '==', value)
                .get();
            return snapshot.docs.map(doc => doc.data() as TaskComment);
        } catch (error) {
            console.error('Error getting comments by field:', error);
            throw error;
        }
    }

    async deleteComment(id: string): Promise<void> {
        try {
            await firestoreAdmin.collection(DBPath.comments).doc(id).delete();
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }

}