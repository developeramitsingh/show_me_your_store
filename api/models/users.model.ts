import { Schema, model, Types } from 'mongoose';
export interface IUsers {
    _id?: Types.ObjectId;
    roleId?: string;
    stores?: string;
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
    stores: [{ type: Schema.Types.ObjectId, ref: 'Stores' }],
    userName: {
        type: String,
        description: "user's name",
    },
    email: {
        type: String,
        unique: true,
        description: "email of user",
        index: 0,
    },
    mobile: {
        type: String,
        unique: true,
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
        default:0,
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