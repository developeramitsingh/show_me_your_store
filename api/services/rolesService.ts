import { IRoles, Roles } from "../models/roles.model";
import { Types } from "mongoose";

class RolesService {
    private constructor () {}
    static instance: RolesService;

    public static getInstance() {
        if(!RolesService.instance) {
            RolesService.instance = new RolesService();
        }

        return RolesService.instance;
    }

    public async createRole(data: IRoles): Promise<any> {
        const newRole = new Roles(data);
        return newRole.save();
    };

    public async getRoleById(id: Types.ObjectId, attrib: string | string[]): Promise<IRoles | any>{
        try {
            return await Roles.findOne({ _id: id}, attrib);
        } catch (err) {
            console.error(`error in updateRoleByQuery: ${err}`);
        }
    }

    public async getRoleByQuery(query: any, attrib: string | string[]): Promise<IRoles | any>{
        try {
            return await Roles.findOne(query, attrib);
        } catch (err) {
            console.error(`error in updateRoleByQuery: ${err}`);
        }
    }

    public async getAllRoleByQuery(query: any, attrib?: string | string[]): Promise<IRoles[] | any>{
        try {
            return await Roles.find(query, attrib).exec();
        } catch (err) {
            console.error(`error in updateRoleByQuery: ${err}`);
        }
    }

    public async updateRoleByQuery(data: IRoles, query: any): Promise<any> {
        try {
            await Roles.updateOne(query, data);
        } catch (err) {
            console.error(`error in updateRoleByQuery: ${err}`);
        }
    };

    public async updateRoleManyByQuery(data: IRoles[] | IRoles, query: any): Promise<any> {
        try {
            await Roles.updateOne(query, data);
        } catch (err) {
            console.error(`error in updateRoleManyByQuery: ${err}`);
        }
    };
}

const rolesService = RolesService.getInstance();
export default rolesService;