import * as jwt from 'jsonwebtoken';
import config from '../../config';

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

  	return request.user;
}

const getSecret = (request: any) => {
	const url = request.originalUrl;

	if (url) {
		return config.jwt.jwtSecret;
	}
}

const getUserRole = (user: any) => {
	if (user && user.roles && user.roles.roleKey) {
		return user.roles.roleKey;
	} else {
		return null;
	}
}