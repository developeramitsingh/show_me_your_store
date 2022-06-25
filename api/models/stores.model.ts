import { Schema, model, Types } from 'mongoose';
export interface IStores {
    _id?: Types.ObjectId;
    storeName?: string;
    storeType?: string;
    storeCategory?: string;
    storeAddress?: string;
    storePincode?: number;
    storeState?: string;
    storePhone?: string;
    storeCity?: string;
    isActive?: boolean;
    storeImg?: string;
    storeImgThumb?: string;
    longitude?: Types.Decimal128;
    latitude?: Types.Decimal128;
    createdAt?: Date;
    updatedAt?: Date;
}

const storesSchema = new Schema <IStores> ({
    storeName: {
        type: String,
        description: "store name",
        index: 0,
    },
    storeType: {
        type: String,
        description: "store type (distributor, wholesaler, retailer)",
        index: 0,
        
    },
    storeCategory: {
        type: String,
        description: "category of business (electrical, grocery shop, hardware sanitary, flowers, bakery etc)",
        index: 0,
        
    },
    storeAddress: {
        type: String,
        description: "store's complete address", 
    },
    storePincode: {
        type: Number,
        description: "pin code of store area",
        index: 0,
        
    },
    storeState: {
        type: String,
        description: "state in which store is opened",
        index: 0,
        
    },
    storeCity: {
        type: String,
        description: "city in which store is",
        index: 0,
    },
    storePhone: {
        type: String,
        description: "store contact number",
    },
    storeImg: {
        type: String,
        description: "store actual image",
    },
    isActive: {
        type: Boolean,
        default: true,
        description: "",
        index: 0,
    },
    longitude: {
        type: Types.Decimal128,
        description: "",
    },
    latitude: {
        type: Types.Decimal128,
        description: "",
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

export const Stores  = model<IStores>('Stores', storesSchema);