import { response, Router } from "express";
import { DatabaseProviderType } from "../../types";
import { Routes } from "../routePaths";
import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from "../../services/EventService";
const v1Router = Router();

const provider: DatabaseProviderType = process.env
.DB_PROVIDER as DatabaseProviderType;

v1Router.get(Routes.health, (req, res) => {
    res.status(200).json({
        message: ' Welcome to AthleteConnect v1: Server is up and running',
    });
});

v1Router.post(Routes.events, async (req, res) => {
    try {
        const userId = req.body.userId;
        res.json(await createEvent(req.body,userId));
    } catch (err:unknown) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
        
    });

    v1Router.get(Routes.events, async (req, res) => {
        try {
           const id = req.query.id as string;
              const response =  await getEvent(id);
              res.status(response.status).json(response);
        } catch (err:unknown) {
            console.error(err);
            res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    });

    v1Router.get(Routes.eventList, async (req, res) => {
        try{
            const response = await getAllEvents();
            res.status(response.status).json(response);
        } catch (err:unknown) {
            const error = err as Error;
            console.error(error.message);
            res.status(500).json({
                message: 'Internal server error',
                success: false,
            });
        }
    });

    v1Router.delete(Routes.events, async (req, res) => {
        try{
            const id = req.query?.id as string | undefined;
            const response = await deleteEvent(id);
            res.status(response.status).json(response);
        } catch (err: unknown) {
            const error = err as Error;
            res.status(500).send({
                status: "error",
                message: error.message,
            });
        }
    });

    v1Router.put(Routes.events, async (req, res) => {
        try {
            const id = req.query.id as string;
            const response = await updateEvent(id,req.body);
            res.status(response.status).json(response);
        } catch (err: unknown) {
            const error = err as Error;
            res.status(500).send({
                status: "error",
                message: error.message,
            });
        }
    });

    

export default v1Router;