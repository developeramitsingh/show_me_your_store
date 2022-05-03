import { permittedCrossDomainPolicies } from 'helmet';
import * as jwt from 'jsonwebtoken';
import config from '../../config';
import Constant from '../constant/constant';
import { logInConsole } from '../utils/utils';

export const JWT = async(request: any, response: any, next: any) => {
	try {
		await decodeJWT(request, response);
		console.log('token decoded');
	} catch(error) {
		console.error(error);
		next(error);
	}
}

const decodeJWT = async (request: any, response: any) => {
	console.log('Decode and verify JWT token');
	try {
		const cookieName: string = 'token';
		const token = request.cookies[cookieName] 
			? request.cookies[cookieName]
			: request.headers.authorization &&
			request.headers.authorization.split(' ')[1];
		if(!token) {
			throw new Error('JWT is required');
		}
		let secret: any = getSecret(request);

		request.user = await jwt.verify(token, secret);

		logInConsole(request.user);
		return request.user;
	} catch (err) {
		console.error(`error in decodeJWT: ${err}`);
	}
}

const getSecret = (request: any) => {
	const url = request.originalUrl;

	if (url) {
		return config.jwt.jwtSecret;
	}
}

export const allowOnlySA = async (request: any, response: any, next: any) => {
	try {
	  console.info('api access check: allow only SA');
  
	  const user = await decodeJWT(request, response);
	  const userRole = getUserRole(user);
	  if (!userRole) {
		throw new Error();
	  }
  
	  if (userRole === Constant.ROLES.SA) {
		next();
	  } else {
		throw new Error('User not allowed');
	  }
	} catch (error) {
	  next(error);
	}
};

export const allowOnlySAAndCA = async (request: any, response: any, next: any) => {
	try {
		const user = await decodeJWT(request, response);
		const userRole: string = getUserRole(user);

		if (!userRole) {
			throw new Error();
		}

		if ([Constant.ROLES.SA, Constant.ROLES.CA].includes(userRole)) {
			next();
		} else {
			throw new Error('User not allowed');
		}
	} catch (error) {
		next(error);
	}
}

export const allowAllRoles = async (request: any, response: any, next: any) => {
	try {
		const user = await decodeJWT(request, response);
		const userRole: string = getUserRole(user);

		if (!userRole) {
			throw new Error();
		}

		if ([Constant.ROLES.SA, Constant.ROLES.CA, Constant.ROLES.UA].includes(userRole)) {
			next();
		} else {
			throw new Error('User not allowed');
		}
	} catch (error) {
		next(error);
	}
}

export const allowSAAndUA = async (request: any, response: any, next: any) => {
	try {
		const user = await decodeJWT(request, response);
		const userRole: string = getUserRole(user);

		if (!userRole) {
			throw new Error();
		}

		if ([Constant.ROLES.SA, Constant.ROLES.UA].includes(userRole)) {
			next();
		} else {
			throw new Error('User not allowed');
		}
	} catch (error) {
		next(error);
	}
}

function getUserRole(user: any) {
	if (user && user.roleId && user.roleId.roleKey) {
		return user.roleId.roleKey;
	} else {
		return null;
	}
}