export class LoginData {

    //Esta clase contiene los datos necesarios para loguearse (usuario y contraseña)
    mail: string;
    password: string;

    constructor(mail, password) 
    {
        this.mail = mail;
        this.password = password;
    }
}