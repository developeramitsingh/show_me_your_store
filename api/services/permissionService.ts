import { IPermission, Permission } from "../models/permission.model";
import { Types } from "mongoose";

class PermissionService {
    private constructor () {}
    static instance: PermissionService;

    public static getInstance() {
        if(!PermissionService.instance) {
            PermissionService.instance = new PermissionService();
        }

        return PermissionService.instance;
    }

    public async createPermission(data: IPermission): Promise<any> {
        const newPermission = new Permission(data);
        return newPermission.save();
    };

    public async getPermissionById(id: Types.ObjectId, attrib?: string | string[]): Promise<IPermission | any>{
        try {
            return await Permission.findOne({ _id: id}, attrib);
        } catch (err) {
            console.error(`error in updatePermissionByQuery: ${err}`);
        }
    }

    public async getPermissionByQuery(query: any, attrib?: string | string[]): Promise<IPermission | any>{
        try {
            return await Permission.findOne(query, attrib);
        } catch (err) {
            console.error(`error in updatePermissionByQuery: ${err}`);
        }
    }

    public async getAllPermissionByQuery(query: any, attrib?: string | string[]): Promise <IPermission[] | any> {
        try {
            return await Permission.find(query, attrib).exec();
        } catch (err) {
            console.error(`error in updatePermissionByQuery: ${err}`);
        }
    }

    public async updatePermissionByQuery(data: IPermission, query: any): Promise<any> {
        try {
            await Permission.updateOne(query, data);
        } catch (err) {
            console.error(`error in updatePermissionByQuery: ${err}`);
        }
    };

    public async updatePermissionManyByQuery(data: IPermission[] | IPermission, query: any): Promise<any> {
        try {
            await Permission.updateOne(query, data);
        } catch (err) {
            console.error(`error in updatePermissionManyByQuery: ${err}`);
        }
    };
}

const permissionService = PermissionService.getInstance();
export default permissionService;