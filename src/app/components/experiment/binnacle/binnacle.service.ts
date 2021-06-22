import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Identifier } from '../../shared/model/identifier'
import { Note } from './model/note'

@Injectable()
export class BinnacleService {

    urlBase = 'http://localhost:8090/binnacle';                             //--LOCAL

    //Sirve para identificar si una nota ha sido creado o no
    noteCreated: Boolean = false; 

    constructor(
        private http: HttpClient
    ){}

    /**
     * Envía una petición al servidor para registrar un nueva nota
     * @param note , datos enviados
     */
    public register(note: Note){
        var url = this.urlBase + "/register/note";
        var body = note;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.post(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Envía una petición al servidor para actualizar un nueva nota
     * @param note , datos enviados
     */
    public update(note: Note){
        var url = this.urlBase + "/update/note";
        var body = note;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }

    /**
     * Envía una petición al servidor para eliminar un nota
     * @param id , datos enviados
     */
    public delete(id: Identifier){
        var url = this.urlBase + "/delete/note";
        var body = id;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        var resObservable = this.http.put(url, body, { headers: headers });
        return resObservable;
    }



    /**
     * Envía una petición al servidor para obtener la lista de notas de un experimento
     * @param idExperiment identificador del experimento
     */
    public getNotes(idExperiment: number){
        var url = this.urlBase + "/notes/experiment/" + idExperiment;
        var headers = new HttpHeaders();
        headers.append('Content-Type', 'application/JSON');
        return this.http.get<any>(url, { headers: headers })
        .toPromise()
        .then(res => <Note[]>res)
        .then(data => { return data; });
    }

}