import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalculateData } from './model/calculateData';
import { User } from './model/user';
import { Strategy } from './model/strategy';
import { Scene } from './model/scene';
import { DemographicDataDTO } from './model/demographicData';
import { Observable } from 'rxjs';
import { EventDTO } from './model/event';
import { Filter } from './model/filter';

@Injectable()
export class ExperimentDataService {

    urlBase = 'http://localhost:8090/experimentdata';                             //--LOCAL
    token;

    constructor(
        private http: HttpClient
    ){}
 
    /**
     * Envía una petición al servidor para obtener el cálculo 
     * @param calculateData , datos enviados
     */
     public calculate(calculateData: CalculateData){
        var url = this.urlBase + "/calculate";
        var body = calculateData;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        return this.http.post<any>(url, body, { headers: headers })
        .toPromise()
        .then(res => <Map<String,[]>>res)
        .then(data => { return data; });
    }

    /**
     * Devuelve la lista de usuarios que realizaron el experimento a partir del identificador del experimento
     * @param idExperiment identificador del experimento
     * @returns  lista de usuarios
     */
    public getUsers(idExperiment: number){
        var url = this.urlBase + "/users/" + idExperiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <User[]>res)
        .then(data => { return data; });
    }

    /**
     * Devuelve la lista de scenas registradas en el experimento a partir del identificador del experimento
     * @param idExperiment identificador del experimento
     * @returns  lista de escenas
     */
     public getScenes(idExperiment: number){
        var url = this.urlBase + "/scenes/" + idExperiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <Scene[]>res)
        .then(data => { return data; });
    }

    /**
     * Devuelve la lista de estrategias para realizar los distintos cálculos solicitados
     * @returns  la lista de estrategias
     */
    public getStrategys(){
        var url = this.urlBase + "/strategys";
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <Strategy[]>res)
        .then(data => { return data; });
    }

    /**
     * Devuelve la lista de filtros para realizar los distintos cálculos solicitados
     * @returns  la lista de filtros
     */
     public getFilters(){
        var url = this.urlBase + "/filters";
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <Filter[]>res)
        .then(data => { return data; });
    }

     /**
     * Devuelve la lista de datos demográficos del experimento
     * @returns  la lista de datos demográficos
     */
      public getDemographicData(idExperiment: number){
        var url = this.urlBase + "/demographicdata/" + idExperiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <DemographicDataDTO[]>res)
        .then(data => { return data; });
    }

    /**
     * Realiza una petición al servidor para realizar el cierre de un experimento que se pasa como parámetro
     * @param id identificador del experimento
     */
     public getScriptFile(idExperiment: number): Observable<Blob>{
        var url = this.urlBase + "/file/" + idExperiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        var resObservable = this.http.get(url, {
            responseType: 'blob'
        });
        return resObservable;
    }

    /**
     * Realiza una petición al servidor para obtener la lista de eventos a partir del usuario, escena y experimento
     * @param idExperiment identificador del experimento
     * @param scene identificador de la escena
     * @param user identificador del usuario
     */
    public getEvents(idExperiment: number, scene: string, user: string){
        var url = this.urlBase + "/events/" + user + "/" + scene + "/" + idExperiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        headers.append('token', this.token);
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <EventDTO[]>res)
        .then(data => { return data; });
    }

}