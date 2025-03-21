import { validateStringType } from "../../helpers/typeValidator";
import { DBResponse, PaginationData, PaginationResult, Profile, User } from "../../types";
import IAuth from "./IAuth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
    firebaseAuthAdmin,
    firebaseAuthClient,
    firestoreAdmin,
  } from "../../config/firebase_config";
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
        if (!token) {
          return Promise.resolve({
            success: false,
            message: "Token is required",
            status: 400,
          });
        }
        try {
          const decodedToken = await firebaseAuthAdmin.verifyIdToken(token);
          await signOut(firebaseAuthClient);
          await firebaseAuthAdmin.revokeRefreshTokens(decodedToken.uid);
    
          return Promise.resolve({
            success: true,
            message: "Log Out Successful",
            status: 200,
          });
        } catch (error: unknown) {
          return {
            success: false,
            message: "Log out failed: " + (error as Error).message,
            status: 500,
          };
        }
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

        async getUser(token?: string, uid?: string): Promise<DBResponse<Profile>> {
            if (!token && !uid) {
              return {
                success: false,
                message: "Token or UID is required",
                status: 400,
              };
            }
            try {
              let userId = uid;
        
              if (!userId && token) {
                const decodedToken = await firebaseAuthAdmin.verifyIdToken(token);
                userId = decodedToken.uid;
              }
        
        
              const userInfo: Profile = (
                await firestoreAdmin.collection(DBPath.profile).doc(userId!).get()
              ).data() as Profile;
              Log.quiet("User Retrieval Successful: ", userInfo.user.authInfo.email);
        
              return Promise.resolve({
                success: true,
                message: "User retrieved successfully",
                status: 200,
                data: userInfo,
              });
            } catch (error: unknown) {
              return {
                success: false,
                message: "Failed to retrieve user: " + (error as Error).message,
                status: 500,
              };
            }
          }

          async deleteUser(uid: string): Promise<DBResponse<boolean>> {
            try {
              await firebaseAuthAdmin.deleteUser(uid);
              const firestoreResult = await firestoreAdmin
                .collection(DBPath.profile)
                .doc(uid)
                .delete();
              Log.quiet("User Deleted Successfully: ", uid, firestoreResult.writeTime);
        
              return Promise.resolve({
                success: true,
                message: "User deleted successfully: ",
                status: 200,
                data: true,
              });
            } catch (error) {
              Log.error("User was not deleted: ", (error as Error).message);
              return {
                success: false,
                message: "User does not exist",
                status: 500,
              };
            }
          }
          async editUser(
            uid: string,
            data: Record<string, unknown>
          ): Promise<DBResponse<Profile>> {
            try {
              const result = await firestoreAdmin
                .collection(DBPath.profile)
                .doc(uid)
                .update(data);
              const user = await this.getUser(undefined, uid);
              console.log(user, "<<<<<<")
              Log.quiet("User updated successfully: ", result.writeTime);
              return Promise.resolve({
                success: true,
                message: "User updated successfully: ",
                status: 200,
                data: user.data,
              });
            } catch (error) {
              Log.error("User was not updated: ", (error as Error).message);
              return {
                success: false,
                message: "User was not updated: ",
                status: 500,
              };
            }
          }
          async getAllUsers(
            pagination: PaginationData
          ): Promise<DBResponse<PaginationResult<Profile>>> {
            try {
              Log.info("Pagination Data: ",pagination)
              const ref = firestoreAdmin.collection(DBPath.profile);
              const query = ref
                .orderBy("user.authInfo.uid", pagination.orderBy)
                .limit(Number(pagination.limit));
              const paginatedQuery = pagination.cursor
                ? query.startAfter(pagination.cursor)
                : pagination.offset
                ? query.offset(Number(pagination.offset))
                : query;
              const users = await paginatedQuery.get();
              const count = (await paginatedQuery.count().get()).data().count;
              const total = (await ref.count().get()).data().count;
              const token = users.docs[Math.max(0,users.docs.length - 1)]?.data().user.authInfo.uid;
              const nextPageToken = token ?? null;
              const previousPageToken = pagination.cursor;
              const hasNextPage  = Math.min(count, pagination.limit) < total;
              const nextPageOffset = hasNextPage ?  (pagination.offset ?? 0) + pagination.limit : undefined;
              const previousPageOffset = pagination.offset;
              const paginationResult = {
                count,
                total,
                nextPageToken,
                previousPageToken,
                nextPageOffset,
                previousPageOffset,
                data: users.docs.map((doc) => doc.data() as Profile),
              } as PaginationResult<Profile>;
              Log.quiet(
                "Users retrieved: ",
                paginationResult as Omit<PaginationResult<User>, "data">
              );
              return Promise.resolve({
                success: true,
                message: "Users retrieved successfully: ",
                status: 200,
                data: paginationResult,
              });
            } catch (error) {
              Log.error("Users were not retrieved: ", (error as Error).message);
              return {
                success: false,
                message: "Users were not retrieved: ",
                status: 500,
              };
            }
          }
          async generateCustomToken(uid?: string): Promise<DBResponse<string>> {
            if (!uid) {
                return {
                    success: false,
                    message: "User ID is required",
                    status: 400,
                };
            }
            try {
                const customToken = await firebaseAuthAdmin.createCustomToken(uid);
                return {
                    success: true,
                    message: "Token created successfully",
                    status: 200,
                    data: customToken,
                };
            } catch (error) {
                return {
                    success: false,
                    message: "Token was not created: " + (error as Error).message,
                    status: 500,
                };
            }
        }



}
export default FirebaseAuth