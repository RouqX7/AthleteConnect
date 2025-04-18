import { Event } from "../../models/Event";

export interface IEvent {
    addEvent({}: {event: Event}): Promise<string>;
    getAllEvents(): Promise<Event[]>;
    getEvent(id: string): Promise<Event>;
    updateEvent(id: string, data: Event): Promise<Event>;
    getEventByField(field: string, value: string): Promise<Event[]>;
    deleteEvent(id: string): Promise<void>;
}