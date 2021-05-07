import { Injectable } from '@angular/core';

const auths = 'AuthAuthorities';
const mail = 'AuthUsername';
const key = 'AuthToken';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private roles: Array<string> = [];

  constructor() {

  }

  //Guarda el nombre de usuario del usuario en sesión
  saveUser(mail) {
    window.sessionStorage.removeItem(mail);
    window.sessionStorage.setItem(mail, mail);
  }

  //Guarda el token del usuario en sesión
  save(token) {
    window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, token);
  }

  //Guarda el rol del usuario en sesión
  saveAuths(authorities) {
    window.sessionStorage.removeItem(auths);
    window.sessionStorage.setItem(auths, JSON.stringify(authorities));
  }

  getUser() {
    return sessionStorage.getItem(mail);
  }

  //Devuelve el token del usuario en sesión
  getToken() {
    return sessionStorage.getItem(key);
  }

  //Cierra sesión
  out() {
    window.sessionStorage.clear();
  }

  //Devuelve una lista de roles del usuario en sesión
  getAuthorities(){
    this.roles = [];

    if (sessionStorage.getItem(key)) {

      JSON.parse(sessionStorage.getItem(auths)).forEach(auth => {

        this.roles.push(auth.authority);

      });
    }

    return this.roles;
  }
}
