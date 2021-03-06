import * as jwt from 'jsonwebtoken'
import { USER_ROLES } from '../entities/User';


export interface AuthenticationData {
    id: string,
    role: USER_ROLES
}


export class Authenticator {
    public generate(input: AuthenticationData): string {
        const token = jwt.sign(input, String(process.env.JWT_KEY), {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        });

        return token;
    }


    public getTokenData(token: string): AuthenticationData {
        const data = jwt.verify(token, String(process.env.JWT_KEY))

        return data as AuthenticationData
    }
}