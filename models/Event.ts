import Joi from "joi";
import { v4 as uuidv4 } from 'uuid';

export type Event = {
    id: string;
    organizerId: string;  // References `Profile.user.authInfo.uid`
    organizerType: "player" | "club";
    name: string;
    description: string;
    date: Date;
    location: string;
    attendees: string[]; // List of player UIDs attending
    createdAt: Date;
    updatedAt: Date;
}
export const eventSchema = Joi.object({
    id: Joi.string().default(() => uuidv4()),
    organizerId: Joi.string().required(),
    organizerType: Joi.string().default("player"),
    name: Joi.string().default(""),
    description: Joi.string().default(""),
    date: Joi.date().default(() => new Date()),
    location: Joi.string().default(""),
    attendees: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});
