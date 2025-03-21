import { DatabaseProviderType, DBResponse, PaginationData, PaginationResult, Profile } from "../../types";
import FirebaseAuth from "./FirebaseAuth";
import GoogleAuth from "./GoogleAuth";
import IAuth from "./IAuth";

class AuthController implements IAuth {
    
    private provider: DatabaseProviderType;
    private auth: IAuth;
    
    constructor(provider: DatabaseProviderType) {
        this.provider = provider;
        this.auth = new FirebaseAuth();
    }
    
        getInstanceOfAuth(): IAuth {
        return this.auth;
    }
    async login(data: Record<string, unknown>): Promise<DBResponse<{token:string,uid:string}>> {
        return this.auth.login(data);
    }
    
    async logout(token?: string): Promise<DBResponse<void>> {
        return this.auth.logout(token);
    }
    
    async register(data: Record<string, unknown>): Promise<DBResponse<{token:string,uid:string}>> {
        return this.auth.register(data);
    }
    
    async getUser(token?: string, uid?: string): Promise<DBResponse<Profile>> {
        return this.auth.getUser(token, uid);
    }
    
    async oAuthLogin( data: Record<string, unknown>, provider?: string,): Promise<DBResponse<string>> {
        switch (provider) {
            case "google":
                return new GoogleAuth().oAuthLogin(data);
            default:
                return {
                    success: false,
                    message: "Invalid provider",
                    status: 400,
                };
        }
    }
    addUser(data: Profile): Promise<DBResponse<string>> {
        return this.auth.addUser(data);
    }

    deleteUser(uid?: string): Promise<DBResponse<boolean>> {
        if(!uid){
            return Promise.resolve({
                success:false,
                message: "uid not provided",
                status:400,
            })
        }
        return this.auth.deleteUser(uid);
    }
    editUser(uid?: string, data?: Record<string, unknown>): Promise<DBResponse<Profile>> {
        if(!uid){
            return Promise.resolve({
                success:false,
                message: "uid not provided",
                status:400,
            })
        }
        if(!data){
            return Promise.resolve({
                success:false,
                message: "data not provided",
                status:400,
            })
        }
        return this.auth.editUser(uid,data);
    }
    getAllUsers(pagination: PaginationData): Promise<DBResponse<PaginationResult<Profile>>> {
        return this.auth.getAllUsers(pagination);
    }
    generateCustomToken(uid?: string): Promise<DBResponse<string>> {
        return this.auth.generateCustomToken(uid);
    }

}
export default AuthController;