import { response, Router } from "express";
import { DatabaseProviderType } from "../../types";
import { Routes } from "../routePaths";
import {
  createPost,
  deletePost,
  getPost,
  getAllPosts,
  updatePost,
} from "../../services/post/PostService";
import AuthController from "../../services/auth/Auth.controller";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  getMessage,
  updateMessage,
} from "../../services/message/MessageService";

import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent,
} from "../../services/event/EventService";

import {
  createReaction,
  deleteReaction,
  getAllReactions,
  getReaction,
  updateReaction
} from "../../services/reaction/ReactionService";

import {
  createNotification,
  deleteNotification,
  getAllNotifications,
  getNotification,
  updateNotification
} from "../../services/notification/NotificationService";

import {
  createFollow,
  deleteFollow,
  getAllFollows,
  getFollow
} from "../../services/follow/FollowService";

import {
  createComment,
  getAllComments,
  deleteComment,
  getComment,
  updatedComment,
} from "../../services/comment/CommentService";

import {
  createTryout,
  getTryout,
  getAllTryouts,
  deleteTryout,
  updateTryout
} from "../../services/tryout/TryoutService";

const v1Router = Router();

const provider: DatabaseProviderType = process.env
  .DB_PROVIDER as DatabaseProviderType;

v1Router.get(Routes.health, (req, res) => {
  res.status(200).json({
    message: " Welcome to AthleteConnect v1: Server is up and running",
  });
});

const defaultPageLimit = 20;

v1Router.get(Routes.health, (req, res) => {
  res.status(200).json({
    message: " Welcome to AthleteConnect v1: Server is up and running",
  });
});
const auth = new AuthController(provider);

v1Router.post(Routes.register, async (req, res) => {
  try {
    const response = await auth.register(req.body);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.post(Routes.login, async (req, res) => {
  try {
    const response = await auth.login(req.body);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.post(Routes.oAuth, async (req, res) => {
  try {
    // Call the googleSignIn method and return the response
    const provider = req.query.provider as string | undefined;
    const response = await auth.oAuthLogin(req.body, provider ?? "google");
    res.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});
v1Router.post(Routes.logout, async (req, res) => {
  try {
    const { token } = req.body;
    const response = await auth.logout(token);
    res.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.get(Routes.user, async (req, res) => {
  try {
    const { token } = req.body;
    const uid = req.query.uid as string | undefined;
    const response = await auth.getUser(token, uid);
    res.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.post(Routes.user, async (req, res) => {
  try {
    const response = await auth.addUser(req.body);
    res.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.put(Routes.user, async (req, res) => {
  try {
    const response = await auth.editUser(
      req.query?.uid as string | undefined,
      req.body
    );
    res.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.delete(Routes.user, async (req, res) => {
  try {
    const response = await auth.deleteUser(
      req.query?.uid as string | undefined
    );
    res.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.get(Routes.userList, async (req, res) => {
  try {
    const response = await auth.getAllUsers({
      limit: (req.query?.limit as number | undefined) ?? defaultPageLimit,
      cursor: req.query?.cursor as string | undefined,
      offset: req.query?.offset as number | undefined,
      orderBy: (req.query?.orderBy as "desc" | "asc" | undefined) ?? "desc",
    });
    res.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.get(Routes.generateToken, async (req, res) => {
  try {
    const response = await auth.generateCustomToken(
      req.query.uid as string | undefined
    );
    res.json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.post(Routes.events, async (req, res) => {
  try {
    const userId = req.body.userId;
    res.json(await createEvent(req.body, userId));
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.get(Routes.events, async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await getEvent(id);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.get(Routes.eventList, async (req, res) => {
  try {
    const response = await getAllEvents();
    res.status(response.status).json(response);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.delete(Routes.events, async (req, res) => {
  try {
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
    const response = await updateEvent(id, req.body);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.post(Routes.post, async (req, res) => {
  try {
    const userId = req.body.userId;
    //const authorType = req.body.authorType;
    res.json(await createPost(req.body, userId));
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.get(Routes.post, async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await getPost(id);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.get(Routes.postList, async (req, res) => {
  try {
    const response = await getAllPosts();
    res.status(response.status).json(response);
  } catch (err: unknown) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.delete(Routes.post, async (req, res) => {
  try {
    const id = req.query.id as string | undefined;
    const response = await deletePost(id);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      messsage: error.message,
    });
  }
});

v1Router.put(Routes.post, async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await updatePost(id, req.body);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      messsage: error.message,
    });
  }
});
v1Router.post(Routes.messages, async (req, res) => {
  try {
    const userId = req.body.userId;
    res.json(await createMessage(req.body, userId));
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.get(Routes.messages, async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await getMessage(id);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.get(Routes.messageList, async (req, res) => {
  try {
    const response = await getAllMessages();
    res.status(response.status).json(response);
  } catch (err: unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.delete(Routes.messages, async (req, res) => {
  try {
    const id = req.query?.id as string | undefined;
    const response = await deleteMessage(id);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.put(Routes.messages, async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await updateMessage(id, req.body);
    res.status(response.status).json(response);
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.post(Routes.reactions, async (req, res) => {
    try {
        const userId = req.body.userId;
        res.json(await createReaction(req.body, userId));
    } catch (err: unknown) {
        console.error(err);
        res.status(500).json({
        message: "Internal server error",
        success: false,
        });
    }
    });

    v1Router.get(Routes.reactions, async (req, res) => {
        try {
        const id = req.query.id as string;
        const response = await getReaction(id);
        res.status(response.status).json(response);
        } catch (err: unknown) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
        }
    });

    v1Router.get(Routes.reactionList, async (req, res) => {
        try {
        const response = await getAllReactions();
        res.status(response.status).json(response);
        } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
        } 
    });

    v1Router.delete(Routes.reactions, async (req, res) => {
        try {
        const id = req.query?.id as string | undefined;
        const response = await deleteReaction(id);
        res.status(response.status).json(response);
        }
        catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
        }
    });

v1Router.put(Routes.reactions, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await updateReaction(id, req.body);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
        status: "error",
        message: error.message,
        });
    }
});

// Notification Routes

v1Router.post(Routes.notifications, async (req, res) => {
    try {
        const userId = req.body.userId;
        res.json(await createNotification(req.body, userId));
    } catch (err: unknown) {
        console.error(err);
        res.status(500).json({
        message: "Internal server error",
        success: false,
        });
    }
    });

    v1Router.get(Routes.notifications, async (req, res) => {
        try {
        const id = req.query.id as string ;
        const response = await getNotification(id);
        res.status(response.status).json(response);
        } catch (err: unknown) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
        }
    });

    v1Router.get(Routes.notificationList, async (req, res) => {
        try {
        const response = await getAllNotifications();
        res.status(response.status).json(response);
        } catch (err: unknown) {
        const error = err as Error;
        console.error(error.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
        }
    });

    v1Router.delete(Routes.notifications, async (req, res) => {
        try {
        const id = req.query?.id as string | undefined;
        const response = await deleteNotification(id);
        res.status(response.status).json(response);
        }
        catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
        }
    });

    v1Router.put(Routes.notifications, async (req, res) => {
        try {
        const id = req.query.id as string;
        const response = await updateNotification(id, req.body);
        res.status(response.status).json(response);
        } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
        }
    });

// Follow Routes
v1Router.post(Routes.follows, async(req, res) => {
  try {
  const userId = req.body.userId;
  res.json(await createFollow(req.body, userId));
} catch (err:unknown) {
  console.error(err);
  res.status(500).json({
    message: "Internal server error",
    success: false,
  });
}
});

v1Router.get(Routes.follows, async(req , res) => {
  try {
    const id = req.query.id as string;
    const response = await getFollow(id);
    res.status(response.status).json(response);
  } catch (err: unknown){
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.get(Routes.followList, async(req,res) => {
  try {
    const response = await getAllFollows();
    res.status(response.status).json(response);
  } catch (err:unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.delete(Routes.follows, async(req, res) => {
  try {
    const id = req.query?.id as string | undefined;
    const response = await deleteFollow(id);
    res.status(response.status).json(response);
  } catch (err: unknown){
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

//Comment Routes
v1Router.post(Routes.comments, async(req,res) => {
  try {
    res.json(await createComment(req.body));
  } catch (err:unknown){
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.get(Routes.comments, async(req,res) => {
  try{
    const id = req.query.id as string;
    const response = await getComment(id);
    res.status(response.status).json(response);
  } catch (err:unknown){
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      success:false,
    });
  }
});

v1Router.get(Routes.commentList, async(req,res) => {
  try{
    const response = await getAllComments();
    res.status(response.status).json(response);
  } catch (err:unknown) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

v1Router.put(Routes.comments, async (req, res) => {
  try{
    const id = req.query.id as string;
    const response = await updatedComment(id,req.body);
    res.status(response.status).json(response);
  } catch (err:unknown){
    const error = err as Error;
    res.status(500).send({
      status:"Error",
      message: error.message,
    });
  }
});

v1Router.delete(Routes.comments, async(req,res) => {
  try{
    const id = req.query?.id as string | undefined;
    if (!id) {
      throw new Error("Comment ID is required");
    }
    const response = await deleteComment(id);
    res.status(response.status).json(response);
  } catch (err:unknown) {
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

//Tryout Routes

v1Router.post(Routes.tryouts, async(req,res) => {
  try {
    const userId = req.body.userId;
    res.json(await createTryout(req.body,userId));
  } catch (err:unknown){
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success : false,
    });
  }
});

v1Router.get(Routes.tryouts,async(req,res)=> {
  try{
    const id = req.query.id as string;
    const response = await getTryout(id);
    res.status(response.status).json(response);
  } catch ( err:unknown){
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.get(Routes.tryoutList, async(req,res) => {
  try{
    const response = await getAllTryouts();
    res.status(response.status).json(response);
  } catch (err:unknown){
    const error = err as Error;
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

v1Router.put(Routes.tryouts,async(req,res) => {
  try{
    const id = req.query.id as string;
    const response = await updateTryout(id,req.body);
    res.status(response.status).json(response);
  } catch (err:unknown){
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});

v1Router.delete(Routes.tryouts,async(req,res) => {
  try{
    const id = req.query?.id as string | undefined;
    const response = await deleteTryout(id);
    res.status(response.status).json(response);
  } catch (err:unknown){
    const error = err as Error;
    res.status(500).send({
      status: "error",
      message: error.message,
    });
  }
});
 


export default v1Router;
