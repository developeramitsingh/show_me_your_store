import { IUsers} from "../models/users.model";
import { usersService } from "../services";
import {Types} from "mongoose";
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import config from'../../config';

export const userLogin = async(request,response,next) => {
    try{
        let requestBodyData =  request.swagger.params.body.value;
        const mobile = requestBodyData.mobile;
        const passwordRecieved = requestBodyData.password;
        let userData = await usersService.getUserAndRoleByQuery({mobile});
        if(userData) {
            const userPasswordMatched = bcrypt.compareSync(passwordRecieved, userData.password)
            if(userPasswordMatched){
                
                userData = JSON.parse(JSON.stringify(userData));
                delete userData.password;
                const token: any = jwt.sign(userData, config.jwt.jwtSecret, {
                  algorithm: 'HS256',
                  expiresIn: config.jwt.jwtSessionTimeout,
                  issuer: 'showMeYourStore',
                });

                console.debug('Token created, Login Success!');
                response.cookie('token', token, {
                  maxAge: 900000,
                  httpOnly: true,
                  sameSite: 'none',
                  secure: true,
                });

                return response.status(200).send({
                  success: true,
                  message: 'Welcome, You have successfully loggedIn',
                  token,
                })
                return 
            } else {
                return response.status(400).send({succeess:false,message:'User mobile or password incorrect please enter vaild credentials'});
            }
        } else {
            return response.status(400).send({success:false,message:'User not found please register first'});
        }  
        //return response.status(200).send({success:true, data:getAllUserData});

    } catch(err){
        console.error('error in get all active users data ->' ,err);
        next(err);
    }
} 