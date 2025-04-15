import Joi from "joi";
import { v4 as uuidv4 } from "uuid";


export type TaskComment = {
    id: string;
    postId: string;
    userId: string;
    content: string;
    likes: number;
    replyCount: number;
    createdAt: Date;
    updatedAt?: Date;
}
export const commentSchema = Joi.object({
    id: Joi.string().default(() => uuidv4()),
    postId: Joi.string().required(),
    userId: Joi.string().required(),
    content: Joi.string().default(""),
    likes: Joi.number().default(0),
    replyCount: Joi.number().default(0),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});
