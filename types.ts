export type User = {
    uid: string;
    username?: string|null;
    email?: string;
    phone?:string;
    secureLogin?:boolean;
    createdAt?: Date;         
    lastLogin?: Date
}

export type Profile = {
    user:BasicUserInfo;
    verified:boolean;
    accountStatus?: 'active' | 'inactive' | 'suspended'; // Optional: Status of the user account
    lastUpdated?: Date;                                  // Optional: Last profile update timestamp
    preferences?: UserPreferences;
}


export type BasicUserInfo = {
    authInfo: User;
    image?:string|null;
    firstName:string;
    lastName:string;
    bio?:string|null
    isAgreed?: boolean|null;
    location?:LocationData|null;
    website?: string | null;               // Optional: Personal or company website
    socialLinks?: SocialLinks;   

}

export type UserPreferences = {
    theme?: 'light' | 'dark';
    notifications?: {
        email: boolean;
        sms: boolean;
        push: boolean;
    };
    language?: string;                    // Optional: Preferred language for the app
};

export type SocialLinks = {
    twitter?: string;
    linkedIn?: string;
    github?: string;
    facebook?: string;
    [key: string]: string | undefined;    // Allows for flexibility with other social networks
};

export type LocationData = {
    long:number;
    lat:number;
    fullAddress?:string|null;
    country?: string|null;
    areaName?:string|null;
}

export type DatabaseProviderType = 'firebase' | 'mongodb' | 'mysql' | 'postgresql'


export type DBResponse<T> = {
    success: boolean;
    message: string;
    status: number;
    data?: T;
    isError?: boolean;
    errorMessage?: string;
}

