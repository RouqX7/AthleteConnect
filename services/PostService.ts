import {Post} from '../models/Post';
import { DBResponse } from  '../types';
import { firestoreAdmin } from  '../config/firebase_config';
import { DBPath } from '../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";
import { create } from 'domain';

export const postSchema = Joi.object({
    id: Joi.string().required(),
    authorId: Joi.string().required(),
    authorType: Joi.string().valid('player', 'club').required(),
    content: Joi.string().required(),
    images: Joi.array().items(Joi.string()).optional(),
    videos: Joi.array().items(Joi.string()).optional(),
    likes: Joi.number().required(),
    comments: Joi.number().required(),
    createdAt: Joi.date().required(),
});

export const createPost = async (
    post: Partial<Post>,
    userId: string,
    authorType: "player" | "club"
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
            authorType: authorType,
            content: "", 
            images: [],
            videos: [],
            likes: 0,
            comments: 0,
            createdAt: new Date(),
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
