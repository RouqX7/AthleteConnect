import { Profile } from "../types"

export const defaultProfile = (
    email:string,
    uid:string,
    username:string,
    firstName:string,
    lastName:string,
): Profile => {
    return {
        verified: false,
        accountStatus: 'inactive',
        lastUpdated: new Date(),
        preferences: {
            theme: 'light',
            notifications: {
                email: true,
                sms: true,
                push: true,
            },
    },
    user: {
        authInfo: {
            uid,
            email,
            username,
            phone:"",
            secureLogin:true,
            lastLogin: new Date(),
            createdAt: new Date(),
        },
        firstName,
        lastName,
        bio: "",
        image: "",
        location:null,
        socialLinks: {},
        website: "",
        isAgreed:false
    },
} as Profile;
};