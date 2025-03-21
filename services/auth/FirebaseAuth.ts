import { validateStringType } from "../../helpers/typeValidator";
import { DBResponse, Profile } from "../../types";
import IAuth from "./IAuth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {  firebaseAuthClient, firestoreAdmin } from "../../config/firebase_config";
import Log from "../../helpers/logger";
import { DBPath } from "../../config/constants";
import { defaultProfile } from "../../helpers/ModelMocks";


class FirebaseAuth implements IAuth{
    async login(data: Record<string, unknown>): Promise<DBResponse<{ token: string; uid: string; }>> {
        const{email,password} = data;
        if(!email || !password){
            return Promise.resolve({
                success: false,
                message: 'Email and password are required',
                status: 400,
            });
        }
        try {
            validateStringType({
                values: [email,password],
                errorMessage: 'Email and password must be of type string',
            });
            const result = await signInWithEmailAndPassword(
                firebaseAuthClient,
                email as string ,
                password as string);

                const token = await result.user.getIdToken();
                Log.quiet('ID Token:',token);

                return Promise.resolve({
                    success: true,
                    message: 'User logged in successfully',
                    status: 200,
                    data: {token,uid: result.user.uid}, 
                });
            
        } catch (error) {
            return {
                success: false,
                message: "Failed to login: " + (error as Error).message,
                status: 500,
            }
            
        }
    }
    async logout(token?: string): Promise<DBResponse<void>> {
        throw new Error("Method not implemented.");
    }
    async register(data: Record<string, unknown>): Promise<DBResponse<{ token: string; uid: string; }>> {
        const {
            email,
            password,
            firstName,
            lastName,
            username,
            phone,
            image,
            isAgreed,
        } = data as {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            username: string;
            phone: string;
            image: string;
            isAgreed: boolean;
        }
        if (!email || !password) {
            return Promise.resolve({
              success: false,
              message: "Email and password are required",
              status: 400,
            });
          }
          try {
            validateStringType({
                values: [email,password],
                errorMessage: 'Email and password must be of type string',
            });
            const result = await createUserWithEmailAndPassword(
                firebaseAuthClient,
                email as string,
                password as string
            );

            const uid = result.user.uid;
            const token = await result.user.getIdToken();
            Log.quiet("ID Token:", token);
            const dp = defaultProfile(
                email,
                uid,
                username ?? result.user.displayName,
                firstName,
                lastName
            );

            const profile:Profile = {
                ...dp,
                user: {
                    image,
                    isAgreed,
                    ...dp.user,

                },
            };

            await this.addUser(profile)
            Log.quiet("Save User to database completed: ", uid);
            return Promise.resolve({
                success: true,
                message: "User registered successfully",
                status: 200,
                data: {token,uid},
            });
          } catch (error:unknown) {
                return {
                    success: false,
                    message: "Failed to register: " + (error as Error).message,
                    status: 500,
          };

        }

    }
    async addUser(data: Profile): Promise<DBResponse<string>> {
        try {
            const result = await firestoreAdmin
              .collection(DBPath.profile)
              .doc(data.user.authInfo.uid)
              .set(data);
            Log.quiet("User added successfully: ", result.writeTime);
      
            return Promise.resolve({
              success: true,
              message: "User added successfully",
              status: 200,
              data: data.user.authInfo.uid,
            });
          } catch (error) {
            return {
              success: false,
              message: "Failed to add user: " + (error as Error).message,
              status: 500,
            };
          }
        }

}
export default FirebaseAuth