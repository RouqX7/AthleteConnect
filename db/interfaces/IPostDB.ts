import {Post} from "../../models/Post"; 

export interface IPostDB {
    addPost({}: { post: Post; }): Promise<string>;
    getAllPosts(): Promise<Post[]>;
    getPost(id: string): Promise<Post>;
    updatePost(id: string, data: Post): Promise<Post>;
    getPostByField(field: string, value: string): Promise<Post[]>;
    deletePost(id: string): Promise<void>;
}