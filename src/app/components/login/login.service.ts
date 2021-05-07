import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ResponseToken } from '../login/login-files/jwt-response';
import { LoginData } from '../login/login-files/login.credentials';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable()
export class LoginService {

    //urlBase = 'https://hierbabuena.herokuapp.com/';
    urlBase = 'http://localhost:8090/';

    //Identifica si un usuario ha sido registrado
    private investigatorCreated : boolean = false;

    constructor(
        private http: HttpClient
     ) {
     }

     /**
      * Envía una petición al servidor para comprobar si los credenciales que el usuario introdujo en el login son correctos
      * @param data 
      */
    identifyUser(data: LoginData) {
        var url = this.urlBase + "login";
        return this.http.post<ResponseToken>(url, data, httpOptions);
    };

    public setCreated(created: boolean){
      this.investigatorCreated = created;
    }

    public isCreated(): boolean{
      return this.investigatorCreated;
    }

}
