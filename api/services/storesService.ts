import { IStores, Stores } from "../models/stores.model";
import {Types} from "mongoose";
import { logInConsole } from "../utils/utils";
import { IUsers, Users } from "../models/users.model";

class StoresService {
    private constructor () {}
    static instance: StoresService;

    public static getInstance() {
        if(!StoresService.instance) {
            StoresService.instance = new StoresService();
        }

        return StoresService.instance;
    }

    public async createStore(data: IStores): Promise<any> {
        const newStore = new Stores(data);
        return newStore.save();
    };

    public async getStoreById(id: Types.ObjectId, attrib?: string | string[]): Promise<IStores | any>{
        try {
            return await Stores.findOne({ _id: id}, attrib);
        } catch (err) {
            console.error(`error in updateStoreByQuery: ${err}`);
        }
    }

    public async getStoreByQuery(query?: any, attrib?: string | string[]): Promise<IStores | any>{
        try {
            return await Stores.findOne(query, attrib);
        } catch (err) {
            console.error(`error in updateStoreByQuery: ${err}`);
        }
    }

    public async getAllStoreByQuery(query: any, attrib?: string | string[]): Promise<IStores[] | any>{
        try {
            return await Stores.find(query, attrib).exec();
        } catch (err) {
            console.error(`error in getAllStoreByQuery: ${err}`);
        }
    }

    public async getAllStoresUnassignedByQuery(query: any, attrib?: string | string[]): Promise<IStores[] | any>{
        try {
            const users: IUsers[] = await Users.find({}, ['stores']);
            const storeIdsExists: any[] = users.map(user => user.stores || []);
            
            const unAssignedStoreIds: Types.ObjectId[] = [...new Set([].concat(...storeIdsExists))];

            query._id = { $nin: unAssignedStoreIds };
            return await Stores.find(query, attrib).exec();
        } catch (err) {
            console.error(`error in getAllStoresUnassignedByQuery: ${err}`);
        }
    }

    public async updateStoreByQuery(data: IStores, query: any): Promise<any> {
        try {
            await Stores.updateOne(query, data);
        } catch (err) {
            console.error(`error in updateStoreByQuery: ${err}`);
        }
    };

    public async updateStoreManyByQuery(data: IStores[] | IStores, query: any): Promise<any> {
        try {
            await Stores.updateOne(query, data);
        } catch (err) {
            console.error(`error in updateStoreManyByQuery: ${err}`);
        }
    };
}

const storeService = StoresService.getInstance();
export default storeService;