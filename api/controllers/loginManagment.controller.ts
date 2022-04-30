import { IUsers, Users } from "../models/users.model";
import {Types} from "mongoose";
import * as bcrypt from "bcrypt";

export const userLogin = = async(request,response,next) => {
    try{
        let requestBodyData =  request.swagger.params.body.value;
        const mobile = requestBodyData.phone;
        const password = requestBodyData.password;
        let userData = await Users.findOne({ _id: id}, attrib);
        return response.status(200).send({success:true, data:getAllUserData});

    } catch(err){
        console.error('error in get all active users data ->' ,err);
        next(err);
    }
} 