import {Notification} from  '../../models/Notification'
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";

export const notificationSchema = Joi.object({
    id: Joi.string().required(),
    recipientId: Joi.string().required(),
    type: Joi.string().valid("follow", "comment", "event_invite").default("follow"),
    relatedId: Joi.string().default(""),
    read: Joi.boolean().default(false),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
})

export const createNotification = async(
    notification:Partial<Notification>,
    userId:string
):Promise<DBResponse<string>> => {
    try {
        if(!userId){
            return {
                success:false,
                message:"User ID is required",
                status:400,
            }
        }
        const notificationWithDefaults = { 
            id: uuidv4(),
            recipientId: userId,
            type: notification.type ?? "follow",
            relatedId: notification.relatedId || "defaultRelatedId",
            read: notification.read ?? false,
            createdAt: new Date(),
            updatedAt:  new Date(),
        } as Notification;
        const validatedNotification = await notificationSchema.validateAsync(notificationWithDefaults, {
            abortEarly:false,
        });
        await firestoreAdmin.collection(DBPath.notifications)
        .doc(validatedNotification.id)
        .set(validatedNotification);

        return {
            success:true,
            message:"Notification created successfully",
            status:200,
            data:validatedNotification.id,
        };
    } catch (error) {
        return {
            success:false,
            message:"Validation failed" + (error as Error).message,
            status:400,
        }
    }
}

export const getNotification = async (id?: string): Promise<DBResponse<Notification>> => {
    try {
        if (!id) {
            return {
                success: false,
                message: "Notification ID is required",
                status: 400,
            }
        }
        const notification = await firestoreAdmin.collection(DBPath.notifications).doc(id).get();
        if (!notification.exists) {
            return {
                success: false,
                message: "Notification not found",
                status: 404,
            }
        }
        return {
            success: true,
            message: "Notification found",
            status: 200,
            data: notification.data() as Notification,
        }
    } catch (error) {
        return {
            success: false,
            message: "Error fetching notification",
            status: 500,
        }
    }
}

export const getAllNotifications = async (): Promise<DBResponse<Notification[]>> => {
    try {
        const notifications = await firestoreAdmin.collection(DBPath.notifications).get();
        if (notifications.empty) {
            return {
                success: false,
                message: "No notifications found",
                status: 404,
            }
        }
        const notificationsList: Notification[] = [];
        notifications.forEach((notification) => {
            notificationsList.push(notification.data() as Notification);
        });
        return {
            success: true,
            message: "Notifications found",
            status: 200,
            data: notificationsList,
        }
    } catch (error) {
        return {
            success: false,
            message: "Error fetching notifications",
            status: 500,
        }
    }
}

export const updateNotification = async (
    id:string,
    data:Partial<Notification>
):Promise<DBResponse<Notification>> => {
    if(!id){
        return {
            success:false,
            message:"User ID is required",
            status:400,
        };
    }
    try {
        const partialSchema = notificationSchema.fork(Object.keys(notificationSchema.describe().keys),(field) =>
            field.optional()
        );
        const validatedData = await partialSchema.validateAsync(data, {
            ...data,
            updatedAt: new Date(),
            abortEarly:false,
        });
        await firestoreAdmin.collection(DBPath.notifications).doc(id).update(validatedData);
        const updatedNotification = await getNotification(id);
        return {
            success:true,
            message:"Notification updated successfully",
            status:200,
            data:updatedNotification.data,
        };
    } catch (error) {
        return{
            success:false,
            message:"Error updating Notification: " + (error as Error).message,
            status:500,
        }
    }
}

export const deleteNotification = async (id?: string): Promise<DBResponse<string>> => {
    if (!id) {
        return {
            success: false,
            message: "Notification ID is required",
            status: 400,
        }
    }
    try {
        await firestoreAdmin.collection(DBPath.notifications).doc(id!).delete();
        return {
            success: true,
            message: "Notification deleted",
            status: 200,
            data: id!,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error deleting notification: " + (error as Error).message,
            status: 500,
        }
    }
}








