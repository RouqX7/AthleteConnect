import { Tryout } from '../../models/Tryout';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";

export const TryoutService = Joi.object({
    id: Joi.string().required(),
    playerId: Joi.string().required(),
    clubId: Joi.string().required(),
    status: Joi.string().valid('pending','accepted','rejected'),
    appliedAt: Joi.date().default(() => new Date ()),
})

export const createTryout = async (
    tryout: Partial<Tryout>,
    userId:string
) : Promise<DBResponse<string>> => {
    try{
        if(!userId){
            return {
                success:false,
                message: "User ID is required",
                status:400,
            }
        }

        const tryoutwithDefaults = {
            id: uuidv4(),
            playerId: tryout.playerId,
            clubId: tryout.clubId,
            status: tryout.status ?? 'pending',
            appliedAt: new Date(),
        } as Tryout;
        const validatedTryout = await TryoutService.validateAsync(tryoutwithDefaults,{
            abortEarly:false,
        });
        await firestoreAdmin.collection(DBPath.tryout)
        .doc(validatedTryout.id)
        .set(validatedTryout);
    
    return {
        success: true,
        message: "Tryout successfully created",
        status:200,
        data: validatedTryout.id,
    };
} catch (error) {
        return {
            success: false,
            message: " Validation failed" + (error as Error).message,
            status: 400,
        }
    }
}
 
export const getTryout = async (id?: string): Promise<DBResponse<Tryout>> => {
    if(!id){
        return {
            success: false,
            message: "User ID is required",
            status: 400,
        };
    }
    try {
        const result = await firestoreAdmin.collection(DBPath.tryout).doc(id!).get();
        if(result.exists){
            return Promise.resolve({
                success:true,
                message:"Tryout Found",
                status: 200,
                data: result.data() as Tryout,
            });
        } else {
            return {
                success:false,
                message:"Tryout not found",
                status: 404,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Error fetching tryout: " + (error as Error).message,
            status: 500,
        };
    }
}

export const getAllTryouts = async (): Promise<DBResponse<Tryout[]>> => {
    try {
        const tryouts: Tryout[] = [];
        const result = await firestoreAdmin.collection(DBPath.tryout).get();
        result.forEach((doc) => {
            tryouts.push(doc.data() as Tryout);
        });
        return {
            success:true,
            message:"Tryouts Found",
            status: 200,
            data: tryouts,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error fetching tryout: "+ (error as Error).message,
            status: 500,
        };
    }
}