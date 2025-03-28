import { Follow } from '../../models/Follow';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";

export const followSchema = Joi.object({
    id: Joi.string().required(),
    followerId: Joi.string().required(),
    followingId: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date()),
})

export const createFollow = async ( 
    follow: Partial<Follow>,
    userId: string
) : Promise<DBResponse<string>> => {
    try {
        if(!userId){
            return {
                success: false,
                status: 400,
                message: "User Id is required",
            }
        }
        const followWithDefaults = {
            id: uuidv4(),
            followerId: userId,
            followingId: follow.followingId || "defaultFollowingId", // Replace "defaultFollowingId" with your logic
            createdAt: new Date(),
        } as Follow;
        const validatedFollow = await followSchema.validateAsync(followWithDefaults, {
            abortEarly: false,
        });
        await firestoreAdmin.collection(DBPath.followers).doc(validatedFollow.followerId).set(validatedFollow);
        return {
            success: true,
            message: "Follow created successfully",
            status: 200,
            data: validatedFollow.followerId,
        }
    } catch (error) {
        return {
            success: false,
            message: "Validation failed " + (error as Error).message,
            status: 400,
        }
    }
}

export const getFollow = async (id?: string): Promise<DBResponse<Follow>> => {
    if(!id) {
        return {
            success: false,
            message: "ID is required",
            status: 400,
        }
    }
    try {
        const result = await firestoreAdmin.collection(DBPath.followers).doc(id).get();
        if(!result.exists){
            return Promise.resolve({
                success: false,
                message: "Follow not found",
                status: 404
            })
        } else {
            return {
                success: true,
                message: "Follow found",
                status: 200,
                data: result.data() as Follow,
            }
        }
    } catch (error) {
        return {
            success: false,
            message: "Error fetching follow" + (error as Error).message,
            status: 500,
        }
    }
}

export const getAllFollows = async (): Promise<DBResponse<Follow[]>> =>{
    try{
        const result = await firestoreAdmin.collection(DBPath.followers).get();
        const followers:Follow[] = [];
        result.forEach((doc) => {
            followers.push(doc.data() as Follow);
        });
        return {
            success:true,
            message: "Followers found",
            status: 200,
            data: followers,
        }
    } catch (error) {
        return {
            success:false,
            message: "Error fetching followers " + (error as Error).message,
            status: 500,
        }
    }
}

export const deleteFollow = async (id?: string) : Promise<DBResponse<string>> => {
    if(!id){
        return {
            success:false,
            message:"Message Id is required",
            status:400,
        }
    }
    try {
        await firestoreAdmin.collection(DBPath.followers).doc(id!).delete();
        return {
            success:true,
            message:"Follow deleted successfully",
            status:200,
            data: id,
        }
    }
    catch (error) {
        return {
            success:false,
            message:"Error deleting follow" + (error as Error).message,
            status:500,
        }
    }
}