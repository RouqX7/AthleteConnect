import { DBResponse, Profile } from "../../types";

interface IAuth {
    login(data: Record<string, unknown>): Promise<DBResponse<{token:string,uid:string}>>;
    logout(token?: string): Promise<DBResponse<void>>;
    register(data: Record<string, unknown>): Promise<DBResponse<{token:string,uid:string}>>;
    addUser(data: Profile): Promise<DBResponse<string>>;
}

export default IAuth;