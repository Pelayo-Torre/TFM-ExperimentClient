import {Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AdministrationService } from '../administrator.service';
import { InvestigatorService } from '../../investigator/investigator.service';
import { Investigator } from '../../investigator/model/investigator';
import { Identifier } from '../../shared/model/identifier';


@Component({
  selector: 'list-requests',
  templateUrl: './addAdministrator.component.html',
  styleUrls: ['./addAdministrator.component.css' , '../../shared/common-style.css'],
  providers: [MessageService]

})
export class AddAdministratorComponent implements OnInit{

    //Lista de investigadores no administradores
    investigators : Investigator[];

    //Lista de columnas en la tabla
    cols: any[];

    //Identificador del investigador que va a ser cambiado a rol administrador
    id: number;

    //Variable para mostrar/ocultar la ventana modal de confirmación de solicitudes
    displayModal: boolean;

    constructor(
      private administrationService: AdministrationService,
      private investigatorService: InvestigatorService,
      private translate: TranslateService,
      private messageService: MessageService
    ) {
        this.displayModal = false;
     }

    ngOnInit() {

      //Se cargan las solicitudes pendientes
      this.loadInvestigators();

      this.cols = [
        { field: 'name', header: 'name', width: '25%' },
        { field: 'surname', header: 'surname', width: '25%' },
        { field: 'mail', header: 'mail', width: '35%' },
        { field: 'acciones', header: 'acciones', width: '15%' }
      ];
    }

    /**
     * Realiza la carga de investigadores con rol distinto al administrador
     */
    private loadInvestigators(){
        this.investigatorService.getInvestigatorsNotAdmin()
        .then(investigators => this.investigators = investigators);
    }

    /**
     * Muestra la ventana modal de cambio de rol a administrador
     * @param id  identificador del investigador
     */
    public showModal(id: number){
        this.id = id;
        this.displayModal = true;
    }

    /**
     * Oculta la ventana modal de cambio de rol a administrador
     */
    public cancelModal(){
        this.displayModal = false;
    }

    /**
     * Realiza la acción de convertir el rol de administrador
     * @param id Identificador del investigador
     */
    public convert(){
        var resObs = this.administrationService.convertAdministrator(new Identifier(this.id));
        resObs.subscribe(
            res => {
                //Se cierra la ventana modal de confirmación
                this.displayModal = false;
                //Se muestra un mensaje en pantalla indicando que se ha cambiado el rol correctamente
                this.translate.get('administration.addAdministrator.acceptOk').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
                //Se recargan los investigadores
                this.loadInvestigators();
            },
            err => {
                this.translate.get('administration.addAdministrator.acceptKo').subscribe((data:any)=> {
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