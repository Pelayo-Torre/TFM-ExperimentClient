import {Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { SessionStorageService } from 'angular-web-storage';
import { AdministrationService } from '../administrator.service';
import { Request } from '../model/request.component';
import { Identifier } from '../../shared/model/identifier';


@Component({
  selector: 'list-requests',
  templateUrl: './listRequests.component.html',
  styleUrls: ['./listRequests.component.css' , '../../shared/common-style.css'],
  providers: [MessageService]

})
export class ListRequestsComponent implements OnInit{

    //Lista de solicitudes para ser mostradas en la tabla
    requests : Request[];

    //Lista de columnas en la tabla
    cols: any[];

    //Identificador de la solicitud que va a ser aceptada/rechazada
    id: number;

    //Variable para mostrar/ocultar la ventana modal de confirmación de solicitudes
    displayModalAccept: boolean;

    //Variable para mostrar/ocultar la ventana modal de rechazo de solicitudes
    displayModalReject: boolean;

    constructor(
      private administrationService: AdministrationService,
      private translate: TranslateService,
      private session: SessionStorageService,
      private messageService: MessageService
    ) {
        this.displayModalAccept = false;
        this.displayModalReject = false;
     }

    ngOnInit() {

      //Se cargan las solicitudes pendientes
      this.loadRequests();

      this.cols = [
        { field: 'name', header: 'name', width: '25%' },
        { field: 'surname', header: 'surname', width: '25%' },
        { field: 'mail', header: 'mail', width: '35%' },
        { field: 'acciones', header: 'acciones', width: '15%' }
      ];
    }

    /**
     * Muestra la ventana modal de aceptación de la solicitud de aprobación
     * @param id  identificador de la solicitud
     */
    public showModalAcceptRequest(id: number){
      this.id = id;
      this.displayModalAccept = true;
    }

    /**
     * Muestra la ventana modal de rechazo de la solicitud de aprobación
     * @param id  identificador de la solicitud
     */
    public showModalRejectRequest(id: number){
      this.id = id;
      this.displayModalReject = true;
    }

    /**
     * Oculta la ventana modal de aceptación de la solicitud de aprobación
     */
    public cancelShowModalAcceptRequest(){
      this.displayModalAccept = false;
    }

    /**
     * Oculta la ventana modal de rechazo de la solicitud de aprobación
     */
    public cancelShowModalRejectRequest(){
      this.displayModalReject = false;
    }

    /**
     * Realiza la carga de solicitudes de aprobación
     */
    public loadRequests(){
      this.administrationService.getPendingRequests()
      .then(requests => this.requests = requests);
    }

    /**
     * Realiza la acción de aceptar una solicitud de aprobación de cuenta
     * @param id Identificador de la solicitud que va a ser aceptada
     */
    public acceptRequest(){
      var resObs = this.administrationService.accept(new Identifier(this.id));
      resObs.subscribe(
          res => {
              //Se cierra la ventana modal de confirmación
              this.displayModalAccept = false;
              //Se muestra un mensaje en pantalla indicando que la solicitud ha sido creada correctamente
              this.translate.get('administration.requests.acceptOk').subscribe((data:any)=> {
                  this.show('success', 'Success', data);
              });
              //Se recarga los investigadores que pueden ser asociados al experimento
              this.loadRequests();
          },
          err => {
              this.translate.get('administration.requests.acceptKo').subscribe((data:any)=> {
                  this.show('error', 'Error', data);
              });
          }
      );
    }

    /**
     * Realiza la acción de rechazar una solicitud de aprobación de cuenta
     * @param id Identificador de la solicitud que va a ser rechazada
     */
    public rejectRequest(){
      var resObs = this.administrationService.reject(new Identifier(this.id));
      resObs.subscribe(
          res => {
              //Se cierra la ventana modal de confirmación
              this.displayModalReject = false;
              //Se muestra un mensaje en pantalla indicando que la solicitud ha sido rechazada correctamente
              this.translate.get('administration.requests.rejectOk').subscribe((data:any)=> {
                  this.show('success', 'Success', data);
              });
              //Se recargan las solicitudes
              this.loadRequests();
          },
          err => {
              this.translate.get('administration.requests.rejectKo').subscribe((data:any)=> {
                  this.show('error', 'Error', data);
              });
          }
      );
    }

    /**
     * Mostrar alertas en pantalla
     */
    public show(sever: string, summ: string, info: string) {
      this.messageService.add({severity: sever, summary: summ, detail: info});
  }

}