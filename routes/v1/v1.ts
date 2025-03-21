import { response,Router } from "express";
import { DatabaseProviderType } from "../../types";
import { Routes} from '../routePaths';
import { createPost,deletePost,getPost,getAllPosts,updatePost } from '../../services/PostService';
const v1Router = Router();

const provider: DatabaseProviderType = process.env
.DB_PROVIDER as DatabaseProviderType;

v1Router.get(Routes.health, (req, res) => {
    res.status(200).json({
        message: ' Welcome to AthleteConnect v1: Server is up and running',
    });
});

v1Router.get(Routes.post, async(req, res) => {
    try {
        const userId = req.body.userId;
        const authorType = req.body.authorType;
        res.json(await createPost(req.body,userId,authorType));
    } catch (err:unknown) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }


});

v1Router.get(Routes.post, async(req, res) => {
    try {
        const id = req.query.id as string;
        const response = await getPost(id);
        res.status(response.status).json(response);
    } catch ( err:unknown){
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
});

v1Router.get(Routes.post, async(req, res) => {
    try {
        const response = await getAllPosts();
        res.status(response.status).json(response);
    } catch ( err:unknown){
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
});

v1Router.delete(Routes.post, async (req, res) => {
    try{
        const id = req.query.id as string | undefined;
        const response = await deletePost(id);
        res.status(response.status).json(response);
    } catch ( err:unknown){
        const error = err as Error;
        res.status(500).send({
            status: 'error',
            messsage: error.message,
        });
    }
});

v1Router.put(Routes.post, async (req, res) => {
    try {
        const id = req.query.id as string ;
        const response = await updatePost(id, req.body);
        res.status(response.status).json(response);
    } catch ( err:unknown){
        const error = err as Error;
        res.status(500).send({
            status: 'error',
            messsage: error.message,
        });
    }
});


export default v1Router;