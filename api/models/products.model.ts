import { Schema, model, Types } from 'mongoose';
export interface IProducts {
    _id?: Types.ObjectId;
    storeId: Types.ObjectId;
    productName: string;
    productCompany: string;
    productDesc: string;
    isAvailable: boolean;
    productCategory: string;
    warranty: string;
    price: string;
    productImg: string;
    qtyType: string;
    quantity: string;
    searchTags: any;
    createdAt?: Date;
    updatedAt?: Date;
}

const productsSchema = new Schema <IProducts> ({
    storeId: {
        type: Schema.Types.ObjectId,
        description: "store id",
        index: 0,
        ref: 'Stores',
    },
    productName: {
        type: String,
        description: "product name",
        index: 0,
    },
    productCompany: {
        type: String,
        description: "product company",
    },
    productDesc: {
        type: String,
        description: "product description",
    },
    isAvailable: {
        type: Boolean,
        default: true,
        description: "is product available in store",
    },
    productCategory: {
        type: String,
        description: "product category",
    },
    warranty: {
        type: String,
        description: "warranty of product if any",
    },
    price: {
        type: String,
        description: "price of product",
    },
    productImg: {
        type: String,
        description: "image of product",
    },
    qtyType: {
        type: String,
        description: "type of quantity",
    },
    quantity: {
        type: String,
        description: "total quantity",
    },
    searchTags: {
        type: Array,
        description: "product matched keywords for search",
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

export const Products  = model<IProducts>('Products', productsSchema);