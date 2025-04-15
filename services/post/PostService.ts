import {Post} from '../../models/Post';
import { DBResponse } from  '../../types';
import { firestoreAdmin } from  '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";
import { create } from 'domain';

export const postSchema = Joi.object({
    id: Joi.string().required(),
    authorId: Joi.string().required(),
    authorType: Joi.string().valid('player', 'club').default('player'),
    content: Joi.string().default(''),
    images: Joi.array().items(Joi.string()).optional(),
    videos: Joi.array().items(Joi.string()).optional(),
    likes: Joi.number().default(0),
    comments: Joi.number().default(0),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});

export const createPost = async (
    post: Partial<Post>,
    userId: string,
): Promise<DBResponse<string>> => {
    try {
        if(!userId){
            return {
                success: false,
                message: "User ID is required",
                status: 400,
            }
        }
        const postWithDefaults = {
            id: uuidv4(),
            authorId : userId,
            authorType: post.authorType ?? 'player',
            content: post.content ?? '', 
            images: post.images ?? [],
            videos:  post.videos ?? [],
            likes: post.likes ?? 0,
            comments: post.comments ?? 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Post;
        const validatedPost = await postSchema.validateAsync(postWithDefaults,{ 
            abortEarly: false,
        });
        await firestoreAdmin.collection(DBPath.post)
          .doc(validatedPost.id)
          .set(validatedPost);

          return {
            success: true,
            message: "Post successfully created",
            status: 200,
            data: validatedPost.id,
          };
    } catch (error) {
        return { 
            success: false,
            message: " Validation failed" + (error as Error).message,
            status: 400,
        }
    }
}

export const getPost = async ( id?: string): Promise<DBResponse<Post>> => {
    if(!id){
        return {
            success: false,
            message: "User ID is required",
            status: 400,
        };
    }
    try {
        const result = await firestoreAdmin.collection(DBPath.post).doc(id!).get();
        if(result.exists){
            return Promise.resolve({
                success:true,
                message: "Post found",
                status: 200,
                data: result.data() as Post,
            });
        } else {
            return {
                success: false,
                message: " Post not found",
                status: 404,
            };
        }
    } catch (error) {
        return { 
            success: false,
            message: " Error fetching post: " + (error as Error).message,
            status: 500,
        };
    }
}

export const getAllPosts = async (): Promise<DBResponse<Post[]>> => {
    try  {
        const posts: Post[] = [];
        const result = await firestoreAdmin.collection(DBPath.post).get();
        result.forEach((doc) => {
            posts.push(doc.data() as Post);
        });
        return {
            success: true,
            message: "Posts found",
            status: 200,
            data : posts,
        };
    } catch ( error) {
        return {
            success: false,
            message: " Error fetching post: " + (error as Error).message,
            status: 500,
        };
    }
}

export const deletePost = async (id?: string): Promise<DBResponse<string>> => {
    if(!id){
        return {
            success: false,
            message: "User ID is required",
            status: 400,
        };
    }
    try {
        await firestoreAdmin.collection(DBPath.post).doc(id!).delete();
        return {
            success: true,
            message: "Post deleted",
            status: 200,
            data: id!,
        };
    } catch (error) {
        return {
            success: false,
            message: " Error deleting post: " + (error as Error).message,
            status: 500,
        };
    }
}

export const updatePost = async (
    id: string,
    data: Partial<Post>
) : Promise<DBResponse<Post>> => {
    if(!id){
        return {
            success: false,
            message: "User ID is required",
            status: 400,
        };
    }
    try { 
        const partialSchema = postSchema.fork(Object.keys(postSchema.describe().keys), (field) =>
            field.optional()
    );
    const validatedData = await partialSchema.validateAsync(data, {
        ...data,
        updatedAt: new Date(),
        abortEarly: false,
    });
    await firestoreAdmin.collection(DBPath.post).doc(id).update(validatedData);
    const updatedPost = await getPost(id);
    return {
        success:true,
        message:"Post updated successfully",
        status:200,
        data:updatedPost.data,
    };
    } catch (error) {
        return {
            success: false,
            message: "Error updating event: " + (error as Error).message,
            status: 500,
        };
    }
}


