import {Event, eventSchema} from  '../../models/Event'
import { DBResponse } from '../../types';
import { serviceValidators } from '../../utilities/serviceUtilities';
import { DataProvider } from '../../src/providers';


export const createEvent = async(   
    event:Event,
):Promise<DBResponse<string>> => {
   return await serviceValidators<Event,string>({
    schema: eventSchema,
    message: "Event created successfully",
    errorMessage: "Event creation failed",
    data: event,
    next: async (validatedEvent: Event) => {
        const result = await DataProvider.eventDB.addEvent({ event: validatedEvent });
        return result;
    }
})
}

    export const getEvent = async (id?:string): Promise<DBResponse<Event>> => {
       return await serviceValidators<string,Event>({
        message: "Event found",
        errorMessage: "Event not found",
        data: id,
        next: async (validatedId: string) => {
            const result = await DataProvider.eventDB.getEvent(validatedId);
            return result;
        }
    })
    }

    export const getAllEvents = async (): Promise<DBResponse<Event[]>> => {
        return await serviceValidators<undefined,Event[]>({
            message: "Events found",
            errorMessage: "Error fetching events",
            next: async () => {
                const result = await DataProvider.eventDB.getAllEvents();
                return result;
            }
        })
    }

    export const deleteEvent = async (id?:string): Promise<DBResponse<string>> => {
        return await serviceValidators<string, string>({
            message: "Event deleted successfully",
            errorMessage: "Event deletion failed",
            data: id,
            next: async (validatedId: string) => {
                await DataProvider.eventDB.deleteEvent(validatedId);
                return validatedId;
            }
        })
    }

    export const updateEvent = async (
        id:string,
        data:Event
    ):Promise<DBResponse<Event>> => {
        return await serviceValidators<string, Event>({
            message: "Event updated successfully",
            errorMessage: "Event update failed",
            data: id,
            next: async (validatedId: string) => {
                const result = await DataProvider.eventDB.updateEvent(validatedId, data);
                return result;
            }
        })
    }



