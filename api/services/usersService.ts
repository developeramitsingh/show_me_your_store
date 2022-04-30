import { IUsers, Users } from "../models/users.model";
import {Types} from "mongoose";

class UsersService {
    private constructor () {}
    static instance: UsersService;

    public static getInstance() {
        if(!UsersService.instance) {
            UsersService.instance = new UsersService();
        }

        return UsersService.instance;
    }

    public async createUser(data: IUsers): Promise<any> {
        const newStore = new Users(data);
        return newStore.save();
    };

    public async getUserById(id: Types.ObjectId, attrib?: string | string[]): Promise<IUsers | any>{
        try {
            return await Users.findOne({ _id: id}, attrib);
        } catch (err) {
            console.error(`error in updateStoreByQuery: ${err}`);
        }
    }

    public async getUserByQuery(query?: any, attrib?: string | string[]): Promise<IUsers | any>{
        try {
            return await Users.findOne(query, attrib);
        } catch (err) {
            console.error(`error in updateStoreByQuery: ${err}`);
        }
    }

    public async getAllUserByQuery(query: any, attrib?: string | string[]): Promise<IUsers[] | any>{
        try {
            return await Users.find(query, attrib).exec();
        } catch (err) {
            console.error(`error in updateStoreByQuery: ${err}`);
        }
    }

    public async updateUserByQuery(data: IUsers, query: any): Promise<any> {
        try {
            await Users.updateOne(query, data);
        } catch (err) {
            console.error(`error in updateStoreByQuery: ${err}`);
        }
    };

    public async updateUserManyByQuery(data: IUsers[] | IUsers, query: any): Promise<any> {
        try {
            await Users.updateOne(query, data);
        } catch (err) {
            console.error(`error in updateStoreManyByQuery: ${err}`);
        }
    };
}

const userService = UsersService.getInstance();
export default userService;