import Joi from "joi";
import { v4 as uuidv4 } from 'uuid';

export type Post = {
    id: string;	
    authorId: string;  // References `Profile.user.authInfo.uid`
    authorType: "player" | "club";
    content: string;
    images?: string[];  // Optional image attachments
    videos?: string[];  // Optional video attachments
    likes: number;
    comments: number;
    createdAt: Date;
    updatedAt: Date;
};
export const postSchema = Joi.object({
    id: Joi.string().default(() => uuidv4()),
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
