import { Message } from '../../models/Message';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";

export const messageSchema = Joi.object({
    id: Joi.string().required(),
    senderId: Joi.string().required(),
    receiverId: Joi.string().required(),
    content: Joi.string().default(""),
    createdAt: Joi.date().default(() => new Date()),
    read: Joi.boolean().default(false),
    updatedAt: Joi.date().default(() => new Date()),

})

export const createMessage = async (
    message:Partial<Message>,
    userId:string
):Promise<DBResponse<string>> => {
    try {
        if(!userId){
            return {
                success: false,
                status: 400,
                message: "User Id is required",
            }
        }
        const messageWithDefaults = {
            id: uuidv4(),
            senderId: userId,
            receiverId: message.receiverId || "defaultReceiverId", // Replace "defaultReceiverId" with your logic
            content: message.content ?? "",
            createdAt: new Date(),
            read: false,
            updatedAt: new Date(), 
        } as Message;
        const validatedEvent = await messageSchema.validateAsync(messageWithDefaults,{
            abortEarly: false,
        });
        await firestoreAdmin.collection(DBPath.messages).doc(validatedEvent.id).set(validatedEvent);

        return {
            success:true,
            message:"Message created successfully",
            status:200,
            data:validatedEvent.id,
        }
    } catch (error) {
        return {
            success:false,
            message: " Validation failed " + (error as Error).message,
            status:400,
        }
    }
}

export const getMessage = async(id?:string):Promise<DBResponse<Message>> => {
    if(!id){
        return {
            success:false,
            message:"Message Id is required",
            status:400,
        }
    }
    try {
        const result = await firestoreAdmin.collection(DBPath.messages).doc(id!).get();
        if(!result.exists){
            return Promise.resolve ({
                success:false,
                message:"Message not found",
                status:404
            })        
        } else {
            return {
                success:true,
                message:"Message found",
                status:200,
                data:result.data() as Message,
            }
        }
    } catch (error) {
        return {
            success:false,
            message:"Error getting message " + (error as Error).message,
            status:500,
        }
    }
}

export const getAllMessages = async ():Promise<DBResponse<Message[]>> => {
    try {
        const result = await firestoreAdmin.collection(DBPath.messages).get();
        const messages:Message[] = [];
        result.forEach((doc) => {
            messages.push(doc.data() as Message);
        });
        return {
            success:true,
            message:"Messages found",
            status:200,
            data:messages,
        }
    } catch (error) {
        return {
            success:false,
            message:"Error getting messages " + (error as Error).message,
            status:500,
        }
    }
}

export const deleteMessage = async (id?:string):Promise<DBResponse<string>> => {
    if(!id){
        return {
            success:false,
            message:"Message Id is required",
            status:400,
        }
    }
    try {
        await firestoreAdmin.collection(DBPath.messages).doc(id!).delete();
        return {
            success:true,
            message:"Message deleted successfully",
            status:200,
            data:id,
        }
    }
    catch (error) {
        return {
            success:false,
            message:"Error deleting message " + (error as Error).message,
            status:500,
        }
    }
}

export const updateMessage = async (id:string, data:Partial<Message>):Promise<DBResponse<Message>> => {
    if(!id){
        return{
            success:false,
            message:"Message Id is required",
            status:400,
        }
    }

    try {
        const partialSchema = messageSchema.fork(Object.keys(messageSchema.describe().keys),(field) =>
             field.optional());
        const validatedData = await partialSchema.validateAsync(data,{
            ...data,
            updatedAt: new Date(),
            abortEarly:false,
        });
        await firestoreAdmin.collection(DBPath.messages).doc(id).update(validatedData);
        const updatedEvent = await getMessage(id);
        return {
            success:true,
            message:"Message updated successfully",
            status:200,
            data:updatedEvent.data,
        };
    } catch (error) {
        return{
            success:false,
            message:"Error updating message " + (error as Error).message,
            status:500,
        }
    }
}