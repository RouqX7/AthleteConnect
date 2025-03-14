import { Profile } from "../types";

export const defaultProfile = (
    email: string,
    uid: string,
    username: string,
    firstName: string,
    lastName: string,
    profileType: "player" | "club"
): Profile => {
    return {
        verified: false,
        accountStatus: "inactive",
        lastUpdated: new Date(),
        profileType,
        preferences: {
            theme: "light",
            notifications: {
                email: true,
                sms: true,
                push: true,
            },
        },
        user: {
            authInfo: {
                uid,
                firstName,
                lastName,
                email,
                username,
                phone: "",
                secureLogin: true,
                lastLogin: new Date(),
                createdAt: new Date(),
            },
            bio: "",
            image: "",
            location: null,
            socialLinks: {},
            website: "",
            isAgreed: false,
        },
        ...(profileType === "player"
            ? {
                  player: {
                      sports: "",
                      club: null,
                      role: "player",
                      positions: [],
                      socialLinks: {},
                      images: [],
                      websites: [],
                      location: "",
                  },
              }
            : {
                  club: {
                      name: "",
                      sports: "",
                      role: "manager",
                      socialLinks: {},
                      images: [],
                      websites: [],
                      location: "",
                  },
              }),
    };
};
