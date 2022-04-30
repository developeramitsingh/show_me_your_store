import { rolesService } from "../services";
import { usersService } from "../services";
import Constant from '../constant/constant';
import {logInConsole} from '../utils/utils';
import { IUsers} from "../models/users.model";
import { IRoles} from "../models/roles.model";
import storeService from "../services/storesService";

export const checkRoleAndUserExistOrNot = async () => {
	try{
		let rolesData = await rolesService.getRoleByQuery({roleKey: Constant.ROLES.SA});
		logInConsole({ isSARoleExist: rolesData ? true : false});
		if(!rolesData){
            const data:IRoles = {
               roleName : "Super Admin",
               roleKey : "SA",
               roleDesc : "Super admin user all access"

            };
            rolesData = await rolesService.createRole(data);
            logInConsole(rolesData);
		}

		let userData = await usersService.getUserByQuery();
		logInConsole({ isSAUser: userData ? true : false});

		if(!userData){
			const userCreateData:IUsers = {
				roleId    : rolesData._id,
				userName  : "super Admin",
				email     : "superadmin@gmail.com",
				mobile    : "9968470534",
				password  : "test@123"  
			}
			userData = await usersService.createUser(userCreateData);
			logInConsole(userData);
		}



	} catch (err) {
        console.error('error role not create ->' ,err);
	}
}
