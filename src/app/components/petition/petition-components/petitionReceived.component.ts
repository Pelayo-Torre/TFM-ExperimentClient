import {Component, OnInit } from '@angular/core';
import { PetitionService } from '../petition.service'
import { TranslateService } from '@ngx-translate/core';
import { Petition } from '../model/petition';
import { Message } from 'primeng/api';
import { Identifier } from '../../shared/model/identifier'
import {MessageService} from 'primeng/api';


@Component({
  selector: 'petition-received',
  templateUrl: './petition.component.html',
  styleUrls: ['./petition.component.css' , '../../shared/common-style.css'],
  providers: [MessageService]

})
export class PetitionReceivedComponent implements OnInit{ 

    //Lista de peticiones
    petitions: Petition[];

    //Columnas de la tabla
    cols: any[];

    //Estados de la petición para el filtrado
    statuses: any[];

    //representa el mostrar o no la ventana modal de aceptación
    displayAcceptConfirmation: boolean;

    //Representa el mostrar o no la ventana modal de rechazo
    displayRejectConfirmation: boolean;

    //Representa el mostrar o no la ventana modal de cancelación
    displayCancelConfirmation: boolean;

    //Identificador de la petición que se va a cancelar
    private petition : Petition;

    //Identifica si la vista es para peticiones enviadas o recibidas
    petitionSent: boolean = false;

    //Alertas
    msgs: Message[];

    constructor(
        private petitionService: PetitionService,
        private translate: TranslateService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.petitionService.getPetitionsReceived()
            .then(petitions => this.petitions = this.parserDate(petitions));
            
        this.cols = [
            { field: 'title', header: 'titleExperiment', width: '22%' },
            { field: 'description', header: 'descriptionExperiment', width: '25%' },
            { field: 'formatDate', header: 'shippingDate', width: '17%'},
            { field: 'statusPetition', header: 'statePetition', width: '17%' },
            { field: 'manager', header: 'rol', width: '10%' },
            { field: 'actions', header: 'actions', width: '10.5%' }
        ];

        this.statuses = [
            {label: 'PENDING', value: 'PENDING'},
            {label: 'ACCEPTED', value: 'ACCEPTED'},
            {label: 'REJECTED', value: 'REJECTED'},
            {label: 'CANCELLED', value: 'CANCELLED'}
        ]
    }

    /**
     * Realiza la aceptación de una petición
     */
    public acceptPetition(){
        let identifier = new Identifier(this.petition.id);
        var resObs = this.petitionService.accept(identifier);
        resObs.subscribe(
            res => {
                //Se cambia el estado a la petición
                this.petition.statusPetition = 'ACCEPTED';
                 //Se cierra la ventana modal
                this.displayAcceptConfirmation = false;
                //Se muestra un mensaje de confirmación
                this.translate.get('petition.received.acceptSuccess').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('petition.received.acceptErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
                console.log(err)
            }
        )
    }

     /**
     * Realiza el rechazo de una petición
     */
    public rejectPetition(){
        let identifier = new Identifier(this.petition.id);
        var resObs = this.petitionService.reject(identifier);
        resObs.subscribe(
            res => {
                //Se cambia el estado a la petición
                this.petition.statusPetition = 'REJECTED';
                 //Se cierra la ventana modal
                this.displayRejectConfirmation = false;
                //Se muestra un mensaje de confirmación
                this.translate.get('petition.received.rejectSuccess').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('petition.received.rejectErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        )
    }

     /**
     * Realiza la cancelación de una petición
     */
    public cancelPetition(){
        let identifier = new Identifier(this.petition.id);
        var resObs = this.petitionService.cancel(identifier);
        resObs.subscribe(
            res => {
                //Se cambia el estado a la petición
                this.petition.statusPetition = 'CANCELLED';
                 //Se cierra la ventana modal
                this.displayCancelConfirmation = false;
                //Se muestra un mensaje de confirmación
                this.translate.get('petition.sent.cancelSuccess').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('petition.sent.cancelErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        )
    }

    /**
     * Parsea las fechas de creación de las peticiones 
     * @param petitions lista de peticiones
     */
    private parserDate(petitions: Petition[]) : Petition[]{
        petitions.forEach(petition => {
            let date = new Date(petition.shippingDate);
            petition.formatDate = this.parserNumber(date.getDate()) + 
            "/" + this.parserNumber((date.getMonth()+1)) + "/" + this.parserNumber(date.getFullYear())
        });
        return petitions;
    }

    /**
     * Parsea un número si solo tiene un dígito
     * @param num 
     */
    private parserNumber(num: number){
        if(num.toString().length == 1){
            return "0" + num;
        }
        return num;
    }

    /**
     * Muestra la ventana modal de confirmación de aceptar petición
     */
    public showAcceptConfirmationModal(petition: Petition){
        this.displayAcceptConfirmation = true;
        this.petition = petition;
    }

     /**
     * Muestra la ventana modal de confirmación de rechazar petición
     */
    public showRejectConfirmationModal(petition: Petition){
        this.displayRejectConfirmation = true;
        this.petition = petition;
    }

    /**
     * Muestra la ventana modal de confirmación en la cancelación
     */
    public showConfirmationModal(petition: Petition){
        this.displayCancelConfirmation = true;
        this.petition = petition;
    }

    /**
     * Mostrar alertas en pantalla
     */
    public show(sever: string, summ: string, info: string) {
        this.messageService.add({severity: sever, summary: summ, detail: info});
    }

}
