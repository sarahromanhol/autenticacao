import { User } from "../entities/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

    // método para criar novo usuário no banco de dados
    public async createUser(user: User){
        try {
            await BaseDatabase.connection('lbn_user')
            .insert({
                id: user.getId(),
                name: user.getName(),
                email: user.getEmail(),
                password: user.getPassword(),
                role: user.getRole()
            })

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }





    // método para buscar user por email
    public async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await BaseDatabase.connection("lbn_user")
                .select("*")
                .where({ email })
            
            return user[0] && User.toUserModel(user[0]);

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}