import { commentSchema, TaskComment } from '../../models/Comment';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import { serviceValidators } from '../../utilities/serviceUtilities';
import { DataProvider } from '../../src/providers';

export const createComment = async (
    comment: TaskComment,
): Promise<DBResponse<string>> => {
    return await serviceValidators<TaskComment, string>(
        {
            schema:commentSchema,
            message: "Comment created successfully",
            errorMessage: "Failed to create comment",
            data: comment,
            next: async (validatedComment: TaskComment) => {
                const result = await DataProvider.commentDB.addComment({
                    comment: validatedComment
                });
                return result;
            }
        }
    );
};


export const getComment = async (id?: string): Promise<DBResponse<TaskComment>> => {
    return await serviceValidators<string, TaskComment>(
        {
            message: "Comment fetched successfully",
            errorMessage: "Failed to fetch comment",
            data: id,
            next: async (validatedId: string) => {
                const result = await DataProvider.commentDB.getComment(validatedId);
                return result;
            }
        }
    );
}


export const getAllComments = async (): Promise<DBResponse<TaskComment[]>> => {
    try {
        const result = await firestoreAdmin.collection(DBPath.comments).get();
        const comments: TaskComment[] = [];
        result.forEach((doc) => {
            comments.push(doc.data() as TaskComment);
        });
        return {
            success: true,
            message: "Comments found",
            status: 200,
            data: comments,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to get Comments: " + (error as any).message,
            status: 500,
        };
    }
};

export const deleteComment = async (id: string): Promise<DBResponse<string>> => {
    return await serviceValidators<string, string>(
        {
            message: "Comment deleted successfully",
            errorMessage: "Failed to delete comment",
            data: id,
            next: async (validatedId: string) => {
                await DataProvider.commentDB.deleteComment(validatedId);
                return validatedId;
            }
        }
    );
};

export const updatedComment = async(id: string, data: TaskComment): Promise<DBResponse<TaskComment>> => {
    return await serviceValidators<TaskComment, TaskComment>(
        {
            message: "Comment updated successfully",
            errorMessage: "Failed to update comment",
            data: data,
            next: async (validatedData: TaskComment) => {
                const result = await DataProvider.commentDB.updateComment(id, validatedData);
                return result;
            }
        }
    );
};