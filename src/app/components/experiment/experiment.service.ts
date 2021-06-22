import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ExperimentAdd } from './model/experimentAdd'
import { Experiment } from './model/experiment'
import { TypeDemographicData } from './model/demographicData'
import { Identifier } from '../shared/model/identifier';
import { Investigator } from '../investigator/model/investigator'

@Injectable()
export class ExperimentService {

    urlBase = 'http://localhost:8090/experiment';                             

    //Sirve para identificar si un experimento ha sido creado o no
    experimentCreated: Boolean = false; 

    //Sirve para identificar si un experimento ha sido eliminado o no
    deleted: boolean = false;

    //Sirve para actualizar las notas cuando exista un cambio de estado
    isStatusChanged: boolean = false;

    constructor(
        private http: HttpClient
    ){}

    /**
     * Envía una petición al servidor para registrar un nuevo experimento
     * @param experiment , datos enviados
     */
    public register(experiment: ExperimentAdd){
        var url = this.urlBase + "/register";
        var body = experiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.post(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Envía una petición al servidor para actualizar los datos de un experimento
     * @param experiment datos del experimento que serán actualizados
     */
    public update(experiment: Experiment){
        var url = this.urlBase + "/update";
        var body = experiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /** 
     * Envía una petición al servidor para obtener el detalle de los dato de un experimento
     * @param id identificador del experimento del que se quiere obtene el detalle
     */
    public detail(id: number){
        var url = this.urlBase + "/detail/" + id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.get(url, { headers: headers });
        return resObservable;
    }

    /**
     * Realiza una petición al servidor para realizar la apertura de un experimnto que se pasa como parámetro
     * @param id identificador del experimento que se quiere abrir
     */
    public open(id: Identifier){
        var url = this.urlBase + "/open";
        var body = id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Realiza una petición al servidor para realizar la eliminación de un experimento que se pasa como parámetro
     * @param id identificador del experimento
     */
    public delete(id: Identifier){
        var url = this.urlBase + "/delete";
        var body = id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }
    
    /**
     * Realiza una petición al servidor para realizar el cierre de un experimento que se pasa como parámetro
     * @param id identificador del experimento
     */
    public close(id: Identifier){
        var url = this.urlBase + "/close";
        var body = id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Realiza una petición al servidor para realizar la re-apertura de un experimento que se pasa como parámetro
     * @param id identificador del experimento
     */
    public reOpen(id: Identifier){
        var url = this.urlBase + "/reopen";
        var body = id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Devuelve la lista de investigadores asociados al experimento 
     * @param idExperiment identificador del experimento
     */
    public getInvestigatorsOfExperiment(idExperiment: number){
        var url = this.urlBase + "/investigators/" + idExperiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <Investigator[]>res)
        .then(data => { return data; });
    }

    /**
     * Devuelve la lista de investigadores que pueden ser asociados al experimento que se pasa como parámetro
     * @param idExperiment identificador del experimento
     */
    public getInvestigatorsNotAssociatedAnExperiment(idExperiment: number){
        var url = this.urlBase + "/investigators/not/associated/" + idExperiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <Investigator[]>res)
        .then(data => { return data; });
    }

    /**
     * Devuelve la lista de dispositivos existentes sobre los que se realizan los experimentos 
     */
    public getAllTypes(){
        var url = this.urlBase + "/all/types/demographicData";
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <TypeDemographicData[]>res)
        .then(data => { return data; });
    }

}