import { Request, Response } from "express";
import { UserDatabase } from "../data/UserDatabase";
import { User } from "../entities/User";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/idGenerator";

export async function signup(
    req: Request,
    res: Response
) {
    try {

        const { name, email, password, role } = req.body

        // verificando se todos os campos foram preenchidos para cadastrar um novo user
        if (!name || !email || !password || !role) {
            res.status(422).send('Insira corretamente as informações de "name", "email", "password" e "role"')
        }

        // instancia a classe UserDatabase. Ela possui métodos de conexao com o DB.
        // procurando o user pelo email, para verificar que ele nao existe no DB
        const userDatabase = new UserDatabase();
        const user = await userDatabase.findUserByEmail(email);

        if(user) {
            res.status(409).send('Esse email já está cadastrado');
        }


        // gera id com uuid
        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();

        // transforma a senha inserida em uma hash
        const hashManager = new HashManager();
        const hashPassword = await hashManager.hash(password)
        
        // cria novo user, passando a hashpassword
        const newUser = new User(id, name, email, hashPassword, role)
        await userDatabase.createUser(newUser);

        // gera o token de acesso
        const authenticator = new Authenticator();
        const token = authenticator.generate({id, role})
        
        res.status(200).send({
            message: 'Usuário criado com sucesso',
            token
        })


    } catch (error: any) {
        res.status(400).send(error.message || error.sqlMessage)
    }
}