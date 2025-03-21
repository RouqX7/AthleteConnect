import { GoogleAuthProvider} from "firebase/auth";
import { DBResponse } from "../../types";
import { OAuth } from "./IAuth";
import { validateStringType } from "../../helpers/typeValidator";

class GoogleAuth implements OAuth {
    async oAuthLogin(data: Record<string, unknown>): Promise<DBResponse<string>> {
        const { tokenId } = data;
        
        if (!tokenId) {
            return Promise.resolve({
                success: false,
                message: "Google token is required",
                status: 400,
            });
        }

        try {
            // login with google token
            validateStringType({value: tokenId, errorMessage: "Google token must be of type string"});
            const credential = GoogleAuthProvider.credential(tokenId as string);
            //const user = await signInWithCredential(firebaseAuthClient,credential);
            return Promise.resolve({
                success: true,
                message: "Login successful",
                status: 200,
                data: credential.idToken
            });
        } catch (error: unknown) {
            return {
                success: false,
                message: "Failed to login: " + (error as Error).message,
                status: 500,
            };
        }

    }
        
}

export default GoogleAuth;