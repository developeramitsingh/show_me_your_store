import { Schema, model, Types } from 'mongoose';
export interface IRoles {
    _id?: Types.ObjectId;
    roleName?: string;
    roleKey?: string;
    roleDesc?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const rolesSchema = new Schema <IRoles> ({
    roleName: {
        type: String,
        description: "role name",
        index: 0,
    },
    roleKey: {
        type: String,
        description: "key of role",
        index: 0,
        
    },
    roleDesc: {
        type: String,
        description: "role description",
        index: 0,
        
    },
    isActive: {
        type: Boolean,
        default:true,
        description: "active or not",
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

export const Roles  = model<IRoles>('Roles', rolesSchema);