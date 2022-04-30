import { Schema, model, Types } from 'mongoose';
export interface IUsers {
    _id?: Types.ObjectId;
    roleId?: string;
    userName?: string;
    email?: string;
    mobile?: string;
    password?: string;
    isActive?: boolean;
    failedAttempts?: number;
    profileImg?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const usersSchema = new Schema <IUsers> ({
    roleId: { type: Schema.Types.ObjectId, ref: 'Roles' },
    userName: {
        type: String,
        description: "user's name",
    },
    email: {
        type: String,
        description: "email of user",
        index: 0,
    },
    mobile: {
        type: String,
        description: "mobile of user",
    },
    password: {
        type: String,
        description: "password of user",
    },
    isActive: {
        type: Boolean,
        default:true,
        description: "active or not",
    },
    failedAttempts: {
        type: Number,
        description: "login failed attempts of user",
    },
    profileImg: {
        type: String,
        description: "image of user",
    },
    createdAt: {
        type: Date, 
        default: Date.now,
        required: false,
        description: "",
        index: 0,
    },
    updatedAt: {
        type: Date, 
        default: Date.now,
        required: false,
        index: 0,
    }
});

export const Users  = model<IUsers>('Users', usersSchema);