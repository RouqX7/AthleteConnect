import {Post, postSchema} from '../../models/Post';
import { DBResponse } from  '../../types';
import { serviceValidators } from '../../utilities/serviceUtilities';
import { DataProvider } from '../../src/providers';

export const createPost = async (
    post:Post,
): Promise<DBResponse<string>> => {
    return serviceValidators<Post, string>({
        schema: postSchema,
        message: "Post created successfully",
        errorMessage: "Post creation failed",
        data: post,
        next: async (validatedPost: Post) => {
            const result = await DataProvider.postDB.addPost({ post: validatedPost });
            return result;
        },
    });
       
       
}

export const getPost = async ( id?: string): Promise<DBResponse<Post>> => {
    return serviceValidators<string, Post>({
        message: "Post found successfully",
        errorMessage: "Post not found",
        data: id,
        next: async (validatedId: string) => {
            const result = await DataProvider.postDB.getPost(validatedId);
            return result;
        },
    });
}

export const getAllPosts = async (): Promise<DBResponse<Post[]>> => {
    return serviceValidators<undefined, Post[]>({
        message: "Posts found successfully",
        errorMessage: "Failed to fetch posts",
        data: undefined,
        next: async () => {
            const result = await DataProvider.postDB.getAllPosts();
            return result;
        },
    });
}

export const deletePost = async (id?: string): Promise<DBResponse<string>> => {
    return serviceValidators<string, string>({
        message: "Post deleted successfully",
        errorMessage: "Failed to delete post",
        data: id,
        next: async (validatedId: string) => {
            await DataProvider.postDB.deletePost(validatedId);
            return validatedId;
        },
    });
}

export const updatePost = async (
    id: string,
    data: Post
) : Promise<DBResponse<Post>> => {
    return serviceValidators<string, Post>({
        message: "Post updated successfully",
        errorMessage: "Failed to update post",
        data: id,
        next: async (validatedId: string) => {
            const result = await DataProvider.postDB.updatePost(validatedId, data);
            return result;
        },
    });
}

export const getPostByField = async (field: string, value: string): Promise<DBResponse<Post[]>> => {
    return serviceValidators<{ field: string, value: string }, Post[]>({
        message: "Posts found successfully",
        errorMessage: "Failed to fetch posts",
        data: { field, value },
        next: async (validatedData: { field: string, value: string }) => {
            const result = await DataProvider.postDB.getPostByField(validatedData.field, validatedData.value);
            return result;
        },
    });
}


