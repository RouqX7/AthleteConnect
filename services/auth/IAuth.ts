import { DBResponse, Profile, PaginationData, PaginationResult } from "../../types";

interface IAuth {
    login(data: Record<string, unknown>): Promise<DBResponse<{token:string,uid:string}>>;
    logout(token?: string): Promise<DBResponse<void>>;
    register(data: Record<string, unknown>): Promise<DBResponse<{token:string,uid:string}>>;
    addUser(data: Profile): Promise<DBResponse<string>>;
    getUser(token?:string, uid?: string): Promise<DBResponse<Profile>>;
    deleteUser(uid?:string): Promise<DBResponse<boolean>>;
    editUser(uid?:string, data?: Record<string, unknown>): Promise<DBResponse<Profile>>;
    getAllUsers(pagination:PaginationData):Promise<DBResponse<PaginationResult<Profile>>> 
    generateCustomToken(uid?: string): Promise<DBResponse<string>>;
}

export interface OAuth {
    oAuthLogin(data: Record<string, unknown>): Promise<DBResponse<string>>;
  }

export default IAuth;