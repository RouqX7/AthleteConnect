import { Reaction } from '../../models/Reaction';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";



export const reactionSchema = Joi.object({
    id: Joi.string().required(),
    postId: Joi.string().required(),
    userId: Joi.string().required(),
    type: Joi.string().valid("like", "fire", "clap").default("like"),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt:Joi.date().default(() => new Date()),
});

export const createReaction = async (
    reaction: Partial<Reaction>,
    userId: string
): Promise<DBResponse<string>> => {
    try {
        if (!userId) {
            return {
                success: false,
                status: 400,
                message: "User Id is required",
            }
        }
        const reactionWithDefaults = {
            id: uuidv4(),
            postId: reaction.postId || "defaultPostId", // Replace "defaultPostId" with your logic
            userId: userId || "defaultUserId",
            type: reaction.type ?? "like",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Reaction;
        const validatedReaction = await reactionSchema.validateAsync(reactionWithDefaults, {
            abortEarly: false,
        });
        await firestoreAdmin.collection(DBPath.reactions).doc(validatedReaction.id).set(validatedReaction);

        return {
            success: true,
            message: "Reaction created successfully",
            status: 200,
            data: validatedReaction.id,
        }
    } catch (error) {
        return {
            success: false,
            message: " Validation failed " + (error as Error).message,
            status: 400,
        }
    }
}

export const getReaction = async (id?: string): Promise<DBResponse<Reaction>> => {
    try {
        if (!id) {
            return {
                success: false,
                status: 400,
                message: "Reaction ID is required",
            }
        }
        const reaction = await firestoreAdmin.collection(DBPath.reactions).doc(id).get();
        if (!reaction.exists) {
            return {
                success: false,
                status: 404,
                message: "Reaction not found",
            }
        }
        return {
            success: true,
            message: "Reaction found",
            status: 200,
            data: reaction.data() as Reaction,
        }
    } catch (error) {
        return {
            success: false,
            status: 400,
            message: "Error fetching reaction " + (error as Error).message,
        }
    }
}

export const getAllReactions = async (): Promise<DBResponse<Reaction[]>> => {
    try {
        const reactions = await firestoreAdmin.collection(DBPath.reactions).get();
        if (reactions.empty) {
            return {
                success: false,
                status: 404,
                message: "No reactions found",
            }
        }
        const reactionsData: Reaction[] = [];
        reactions.forEach((reaction) => {
            reactionsData.push(reaction.data() as Reaction);
        });
        return {
            success: true,
            status: 200,
            message: "Reactions found",
            data: reactionsData,
        }
    } catch (error) {
        return {
            success: false,
            status: 500,
            message: "Error fetching reactions " + (error as Error).message,
        }
    }
}

export const updateReaction = async (id: string, data: Partial<Reaction>): Promise<DBResponse<Reaction>> => {
    if(!id){
        return {
            success:false,
            message:"User ID is required",
            status:400,
        };
    }
    try {
        const partialSchema = reactionSchema.fork(Object.keys(reactionSchema.describe().keys),(field) =>
            field.optional()
        );
        const validatedData = await partialSchema.validateAsync(data, {
            ...data,
            updatedAt: new Date(),
            abortEarly:false,
        });
        await firestoreAdmin.collection(DBPath.reactions).doc(id).update(validatedData);
        const updatedReaction = await getReaction(id);
        return {
            success:true,
            message:"Event updated successfully",
            status:200,
            data:updatedReaction.data,
        };
    } catch (error) {
        return{
            success:false,
            message:"Error updating Reaction: " + (error as Error).message,
            status:500,
        }
    }
}

export const deleteReaction = async (id?: string): Promise<DBResponse<string>> => {
    if(!id){
        return {
            success:false,
            message:"User ID is required",
            status:400,
        };
    }
    try {
        await firestoreAdmin.collection(DBPath.reactions).doc(id!).delete();
        return {
            success:true,
            message:"Reaction deleted",
            status:200,
            data:id!,
        };
    } catch (error) {
        return {
            success:false,
            message:"Error deleting Reaction: " + (error as Error).message,
            status:500,
        };
    }
}




