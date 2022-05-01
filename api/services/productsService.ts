import { IProducts, Products } from "../models/products.model";
import { Types } from "mongoose";

class ProductsService {
    private constructor () {}
    static instance: ProductsService;

    public static getInstance() {
        if(!ProductsService.instance) {
            ProductsService.instance = new ProductsService();
        }

        return ProductsService.instance;
    }

    public async createProduct(data: IProducts): Promise<any> {
        const newProducts = new Products(data);
        return newProducts.save();
    };

    public async getProductById(id: Types.ObjectId, attrib?: string | string[]): Promise<IProducts | any>{
        try {
            return await Products.findOne({ _id: id}, attrib);
        } catch (err) {
            console.error(`error in getProductById: ${err}`);
        }
    }

    public async getProductByQuery(query?: any, attrib?: string | string[]): Promise<IProducts | any>{
        try {
            return await Products.findOne(query, attrib);
        } catch (err) {
            console.error(`error in getProductByQuery: ${err}`);
        }
    }

    public async getAllProductByQuery(query: any, attrib?: string | string[]): Promise<IProducts[] | any>{
        try {
            return await Products.find(query, attrib).populate('stores').exec();
        } catch (err) {
            console.error(`error in getAllProductByQuery: ${err}`);
        }
    }

    public async updateProductByQuery(data: IProducts, query: any): Promise<any> {
        try {
           return await Products.updateOne(query, data);
        } catch (err) {
            console.error(`error in updateProductByQuery: ${err}`);
        }
    };

    public async updateProductManyByQuery(data: IProducts[] | IProducts, query: any): Promise<any> {
        try {
            await Products.updateOne(query, data);
        } catch (err) {
            console.error(`error in updateProductManyByQuery: ${err}`);
        }
    };
}

const productService = ProductsService.getInstance();
export default productService;