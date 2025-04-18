import { IEvent } from "../interfaces/IEvent";
import { Event } from "../../models/Event";
import { DBPath } from "../../config/constants";
import { firestoreAdmin } from "../../config/firebase_config";

export default class EventDb implements IEvent {
    addEvent = async({ event}: { event: Event; }): Promise<string> => {
        if (!event || !event.id) {
            throw new Error("Event or event ID is missing");
        }
        try {
            await firestoreAdmin
            .collection(DBPath.events)
            .doc(event.id)
            .set(event);
            return event.id
        } catch (error) {
            console.error('Error adding event:', error);
            throw error;
        }
    }
    getAllEvents = async(): Promise<Event[]> => {
        try {
            const snapshot = await firestoreAdmin.collection(DBPath.events).get();
            return snapshot.docs.map(doc => doc.data() as Event);
        } catch (error) {
            console.error('Error getting all events:', error);
            throw error;
        }
    }
    getEvent = async(id: string): Promise<Event> => {
        try {
            const doc = await firestoreAdmin.collection(DBPath.events).doc(id).get();
            if (!doc.exists) {
                throw new Error('Event not found');
            }
            return doc.data() as Event;
        } catch (error) {
            console.error('Error getting event:', error);
            throw error;
        }
    }
    updateEvent = async(id: string, data: Event): Promise<Event> => {
        try {
            await firestoreAdmin.collection(DBPath.events).doc(id).update(data);
            return this.getEvent(id);
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }
    getEventByField = async(field: string, value: string): Promise<Event[]> => {
        try {
            const snapshot = await firestoreAdmin
                .collection(DBPath.events)
                .where(field, '==', value)
                .get();
            return snapshot.docs.map(doc => doc.data() as Event);
        } catch (error) {
            console.error('Error getting events by field:', error);
            throw error;
        }
    }
    deleteEvent = async(id: string): Promise<void> => {
        try {
            await firestoreAdmin.collection(DBPath.events).doc(id).delete();
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }
    
}
