import { DBPath } from "../../config/constants";
import { firestoreAdmin } from "../../config/firebase_config";
import { Post } from "../../models/Post";
import { IPostDB } from "../interfaces/IPostDB";

export default class PostDB implements IPostDB {
    addPost = async({ post }: { post: Post; }): Promise<string> => {
        if (!post || !post.id) {
            throw new Error("Post or post ID is missing");
        }
        try {
            await firestoreAdmin
                .collection(DBPath.post)
                .doc(post.id)
                .set(post);
            return post.id;
        } catch (error) {
            console.error('Error adding post:', error);
            throw error;
        }
    }
    getAllPosts = async(): Promise<Post[]> => {
        try {
            const snapshot = await firestoreAdmin.collection(DBPath.post).get();
            return snapshot.docs.map(doc => doc.data() as Post);
        } catch (error) {
            console.error('Error getting all posts:', error);
            throw error;
        }
    }
    getPost = async(id: string): Promise<Post> => {
        try {
            const doc = await firestoreAdmin.collection(DBPath.post).doc(id).get();
            if (!doc.exists) {
                throw new Error('Post not found');
            }
            return doc.data() as Post;
        } catch (error) {
            console.error('Error getting post:', error);
            throw error;
        }
    }
    updatePost = async(id: string, data: Post): Promise<Post> => {
        try {
            await firestoreAdmin.collection(DBPath.post).doc(id).update(data);
            return this.getPost(id);
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    }
    getPostByField = async(field: string, value: string): Promise<Post[]> => {
        try {
            const snapshot = await firestoreAdmin
                .collection(DBPath.post)
                .where(field, '==', value)
                .get();
            return snapshot.docs.map(doc => doc.data() as Post);
        } catch (error) {
            console.error('Error getting posts by field:', error);
            throw error;
        }
    }
    deletePost = async(id: string): Promise<void> => {
        try {
            await firestoreAdmin.collection(DBPath.post).doc(id).delete();
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }
    
}