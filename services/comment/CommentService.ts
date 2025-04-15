import { Comment } from '../../models/Comment';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";

export const CommentService = Joi.object({
    id: Joi.string().required(),
    postId: Joi.string().required(),
    authorId: Joi.string().required(),
    content: Joi.string().default(""),
    likes: Joi.number().default(0),
    replyCount: Joi.number().default(0),
    createdAt: Joi.date().default(() => new Date ()),
    updatedAt: Joi.date().default(() => new Date()),
})

export const createComment = async (
    comment: Partial<Comment>,
    userId:string
): Promise<DBResponse<string>> => {
    try {
        if(!userId){
            return {
                success: false,
                message: "User ID is required",
                status:400,
            }
        }
        const commentWithDefaults = {
            id: uuidv4(),
            postId: comment.postId,
            authorId: userId,
            content: comment.content ?? '',
            likes: comment.likes ?? 0,
            replyCount: comment.replyCount ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Comment;
        const validatedComment = await CommentService.validateAsync(commentWithDefaults, {
            abortEarly:false,
        });
        await firestoreAdmin.collection(DBPath.comments)
        .doc(validatedComment.id)
        .set(validatedComment);
        return {
            success: true,
            message: "Comment created successfully",
            status: 200,
            data: validatedComment.id,
        };
    } catch (error) {
        return {
            success: false,
            message: "Validation failed " + (error as Error).message,
            status: 400,
        }
    }
}


export const getComment = async (id?: string) : Promise<DBResponse<Comment>> => {
    if(!id) {
        return {
            success:false,
            message: "User ID is required",
            status: 400,
        };
    }
    try {
        const result = await firestoreAdmin.collection(DBPath.comments).doc(id!).get();
        if(result.exists){
            return Promise.resolve({
                success: true,
                message: "Comment found",
                status: 200,
                data: result.data() as Comment,
            })
        } else {
            return {
                success: false,
                message: "Comment not found",
                status: 404,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Error fetching comment:" + (error as Error).message,
            status: 500,
        }
    }
}

export const getAllComments = async (): Promise<DBResponse<Comment[]>> => {
    try {
        const comments: Comment[] = [];
        const result = await firestoreAdmin.collection(DBPath.comments).get();
        result.forEach((doc) => {
            comments.push(doc.data() as Comment);
        });
        return {
            success:true,
            message: "Comments found",
            status: 200,
            data: comments,
        };
    } catch (error){
        return {
            success: false,
            message: " Error fetching comment: " + (error as Error).message,
            status: 500,
        };
    }
}

export const deleteComment = async (id?: string): Promise<DBResponse<string>> => {
    if(!id){
        return {
            success: false,
            message: "User ID is required",
            status: 400,
        };
    }
    try {
        await firestoreAdmin.collection(DBPath.comments).doc(id!).delete();
        return {
            success:true,
            message: "Comment deleted successfully",
            status: 200,
            data: id!,
        };
    } catch (error) {
        return {
            success: false,
            message: " Error deleting comment: " + (error as Error).message,
            status: 500,
        };
    }
}

export const updateComment = async (
    id:string,
    data:Partial<Comment>
) :Promise<DBResponse<Comment>> => {
    if(!id){
        return {
            success: false,
            message: "User ID is required",
            status: 400,
        };
    }
    try{
        const partialSchema = CommentService.fork(Object.keys(CommentService.describe().keys), (field) =>
            field.optional());
        const validatedData = await partialSchema.validateAsync(data,{
            ...data,
            updatedAt: new Date(),
            abortEarly: false,
        });
        await firestoreAdmin.collection(DBPath.comments).doc(id!).update(validatedData);
        const updatedEvent = await getComment(id);
        return {
            success: true,
            message: "Comment updated successfully",
            status:200,
            data: updatedEvent.data,
        };
    } catch (error) {
        return {
            success:false,
            message: "Error updating message" + (error as Error).message,
            status:500,
        }
    }
}