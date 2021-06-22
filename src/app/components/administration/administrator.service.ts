import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Request } from './model/request.component';
import { Identifier } from '../shared/model/identifier';

@Injectable()
export class AdministrationService {

    urlBase = 'http://localhost:8090/administration';                             //--LOCAL

    token;

    constructor(
        private http: HttpClient
    ){}

     /**
      * Registra una solicitud de aprobación de cuenta
      * @param request  los datos de la solicitud
      */
    public register(request: Request){
        var url = this.urlBase + "/register/request";
        var body = request;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.post(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Realiza la aceptación de una aprobación de cuenta
     * @param id los datos de la solicitud
     */
    public accept(id: Identifier){
        var url = this.urlBase + "/accept/request";
        var body = id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Realiza el rechazo de una aprobación de cuenta
     * @param id los datos de la solicitud
     */
    public reject(id: Identifier){
        var url = this.urlBase + "/reject/request";
        var body = id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Realiza la petición para convertir a un investgador en administrador
     * @param id los datos de la solicitud
     */
    public convertAdministrator(id: Identifier){
        var url = this.urlBase + "/convert/administrator";
        var body = id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Devuelve la lista de solicitudes pendientes de aprobación 
     */
    public getPendingRequests(){
        var url = this.urlBase + "/requests";
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        return this.http.get<any>(url, { headers: headers })
            .toPromise()
            .then(res => <Request[]>res)
            .then(data => { return data; });
    }

}