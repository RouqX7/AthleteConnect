import {Event} from  '../models/Event'
import { DBResponse } from '../types';
import { firestoreAdmin } from '../config/firebase_config';
import { DBPath } from '../config/firebase_config';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";
import { abort } from 'process';
import e from 'express';


export const eventSchema = Joi.object({
    id: Joi.string().required(),
    organizerId: Joi.string().required(),
    organizerType: Joi.string().default(""),
    name: Joi.string().default(""),
    description: Joi.string().default(""),
    date: Joi.date().default(() => new Date()),
    location: Joi.string().required(),
    attendees: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
})

export const createEvent = async(
    event:Partial<Event>,
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
        const eventWithDefaults = { 
            id: uuidv4(),
            organizerId: userId,
            organizerType: event.organizerType ?? "player",
            attendees: event.attendees ?? [],
            date: event.date?? new Date(),
            description: event.description ??"",
            location: event.location ??"",
            name: event.name ?? "" ,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Event;
        const validatedEvent = await eventSchema.validateAsync(eventWithDefaults, {
            abortEarly:false,
        });
        await firestoreAdmin.collection(DBPath.events)
        .doc(validatedEvent.id)
        .set(validatedEvent);

        return {
            success:true,
            message:"Event created successfully",
            status:200,
            data:validatedEvent.id,
        };
    } catch (error) {
        return {
            success:false,
            message: " Validation failed " + (error as Error).message,
            status:400,
        }
    }
}

    export const getEvent = async (id?:string): Promise<DBResponse<Event>> => {
        if(!id){
            return {
                success:false,
                message:"Event ID is required",
                status:400,
            };
        }
        try {
            const result = await firestoreAdmin.collection(DBPath.events).doc(id!).get();
            if(result.exists){
                    return Promise.resolve({
                        success: true,
                        message: "Event found",
                        status: 200,
                        data: result.data() as Event
                    });
            } else {
                return {
                    success:false,
                    message:"Event not found",
                    status:404,
                };
            }
        } catch (error) {
            return {
                success:false,
                message: "Error fetching event: " + (error as Error).message,
                status:500,
            };
        }
    }

    export const getAllEvents = async (): Promise<DBResponse<Event[]>> => {
        try {
            const events: Event[] = [];
            const result = await firestoreAdmin.collection(DBPath.events).get();
            result.forEach((doc) => {
                events.push(doc.data() as Event);
            });
            return {
                success:true,
                message:"Events found",
                status:200,
                data:events,
            };
        } catch (error) {
            return {
                success:false,
                message:"Error fetching events: " + (error as Error).message,
                status:500,
            };
        }
    }

    export const deleteEvent = async (id?:string): Promise<DBResponse<string>> => {
        if(!id){
            return {
                success:false,
                message:"Event ID is required",
                status:400,
            };
        }
        try {
            await firestoreAdmin.collection(DBPath.events).doc(id!).delete();
            return {
                success:true,
                message:"Event deleted",
                status:200,
                data:id!,
            };
        } catch (error) {
            return {
                success:false,
                message:"Error deleting event: " + (error as Error).message,
                status:500,
            };
        }
    }

    export const updateEvent = async (
        id:string,
        data:Partial<Event>
    ):Promise<DBResponse<Event>> => {
        if(!id){
            return {
                success:false,
                message:"Event ID is required",
                status:400,
            };
        }
        try {
            const partialSchema = eventSchema.fork(Object.keys(eventSchema.describe().keys),(field) =>
                field.optional()
            );
            const validatedData = await partialSchema.validateAsync(data, {
                ...data,
                updatedAt: new Date(),
                abortEarly:false,
            });
            await firestoreAdmin.collection(DBPath.events).doc(id).update(validatedData);
            const updatedEvent = await getEvent(id);
            return {
                success:true,
                message:"Event updated successfully",
                status:200,
                data:updatedEvent.data,
            };
        } catch (error) {
            return{
                success:false,
                message:"Error updating event: " + (error as Error).message,
                status:500,
            }
        }


    }

