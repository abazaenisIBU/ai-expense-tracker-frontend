export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string; // Name or URL of the profile picture
    createdAt: string; // ISO string format for date-time
    updatedAt: string; // ISO string format for date-time
}