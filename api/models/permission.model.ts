import { Schema, model, Types } from 'mongoose';
export interface IPermission {
    _id?: Types.ObjectId;
    menuName?: string;
    roleId?: string;
    path?: string;
    type?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const permissionSchema = new Schema <IPermission> ({
    menuName: {
        type: String,
    },
    roleId: {
        type: String,
    },
    path: {
        type: String,
    },
    type: {
        type: String,
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

export const Permission  = model<IPermission>('Permission', permissionSchema);