import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Petition } from './model/petition';
import { Identifier } from '../shared/model/identifier';

@Injectable()
export class PetitionService {

    //urlBase = 'https://hierbabuena.herokuapp.com/petition';               //--PRODUCCIÓN
    urlBase = 'http://localhost:8090/petition';                             //--LOCAL

    token;

    constructor(
        private http: HttpClient
    ){}

    /**
     * Envía una petición al servidor para registrar una nueva petición
     * @param petition , datos enviados
     */
    public register(petition: Petition){
        var url = this.urlBase + "/register";
        var body = petition;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.post(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Envía una petición al servidor para obtener la lista de peticiones enviadas por el usuario en sesión
     */
    public getPetitionsSent(){
        var url = this.urlBase + "/sent";
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <Petition[]>res)
        .then(data => { return data; });
    }

    /**
     * Envía una petición al servidor para obtener la lista de peticiones recibidas por el usuario en sesión
     */
    public getPetitionsReceived(){
        var url = this.urlBase + "/received";
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <Petition[]>res)
        .then(data => { return data; });
    }

    /**
     * Envía una petición al servidor para aceptar una petición
     * @param identifier identificador de la petición
     */
    public accept(identifier: Identifier){
        var url = this.urlBase + "/accept";
        var body = identifier;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Envía una petición al servidor para rechazar una petición
     * @param identifier identificador de la petición
     */
    public reject(identifier: Identifier){
        var url = this.urlBase + "/reject";
        var body = identifier;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Envía una petición al servidor para cancelar una petición
     * @param identifier identificador de la petición
     */
    public cancel(identifier: Identifier){
        var url = this.urlBase + "/cancel";
        var body = identifier;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Envía una petición al servidor para cancelar la asociación entre un investigador y un experimento
     * @param petition, datos de entrada
     */
    public cancelAssociation(petition: Petition){
        var url = this.urlBase + "/cancel/association";
        var body = petition;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

}