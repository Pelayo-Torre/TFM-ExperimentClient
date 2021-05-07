import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Experiment } from '../experiment/model/experiment'
import { InvestigatorAdd, Investigator } from './model/investigator'

@Injectable()
export class InvestigatorService {

    //urlBase = 'https://hierbabuena.herokuapp.com/investigator';               //--PRODUCCIÓN
    urlBase = 'http://localhost:8090/investigator';                             //--LOCAL
    token;

    constructor(
        private http: HttpClient
    ){}

    /**
     * Envía una petición al servidor para registrar un nuevo investigador
     * @param investigator , datos enviados
     */
    public register(investigator: InvestigatorAdd){
        var url = this.urlBase + "/register";
        var body = investigator;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.post(url, body, { headers: headers });
        return resObservable;
    }


    /**
     * Envía una petición al servidor para obtener a un investigador a partir del email
     * @param mail parámetro de entrada
     */
    public getInvestigatorByMail(mail: String){
        var url = this.urlBase + "/mail/" + mail;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        var resObservable = this.http.get(url, { headers: headers });
        return resObservable;
    }

    /**
     * Envía una petición al servidor para obtener a un investigador a partir del username
     * @param mail parámetro de entrada
     */
    public getInvestigatorByUsername(username: String){
        var url = this.urlBase + "/username/" + username;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        var resObservable = this.http.get(url, { headers: headers });
        return resObservable;
    }

    /**
     * Envía una petición al servidor para obtener la lista de experimentos de un investigador
     * @param id identificador del investigador
     */
    public getExperimentsAcceptedByInvestigator(id: number){
        var url = this.urlBase + "/experiments/accepted/" + id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <Experiment[]>res)
        .then(data => { return data; });
    }

    /**
     * Devuelve los datos del investigador que se encuentra en sesión
     */
    public getUserInSession(){
        var url = this.urlBase + "/in/session";
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        var resObservable = this.http.get(url, { headers: headers });
        return resObservable;
    }

    /**
     * Convierte a un investigador de la aplicación en Administrador
     */
    public getNotAdministrators(){
        var url = this.urlBase + "/list/not/administrator";
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        var resObservable = this.http.get(url, { headers: headers });
        return resObservable;
    }

    /**
     * Realiza la actualización de los datos de un investigador
     */
    public updateInvestigator(investigator: Investigator){
        var url = this.urlBase + "/update";
        var body = investigator;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Realiza una petición para obtener la lista de investigadores que no son administradores
     */
    public getInvestigatorsNotAdmin(){
        var url = this.urlBase + "/list/not/administrator/";
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
            .toPromise()
            .then(res => <Investigator[]>res)
            .then(data => { return data; });
    }
}