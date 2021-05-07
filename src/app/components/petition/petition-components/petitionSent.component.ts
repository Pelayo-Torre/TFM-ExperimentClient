import {Component, OnInit } from '@angular/core';
import { PetitionService } from '../petition.service'
import { TranslateService } from '@ngx-translate/core';
import { Petition } from '../model/petition';
import { Message } from 'primeng/api';
import { Identifier } from '../../shared/model/identifier'
import {MessageService} from 'primeng/api';


@Component({
  selector: 'petition-sent',
  templateUrl: './petition.component.html',
  styleUrls: ['./petition.component.css' , '../../shared/common-style.css'],
  providers: [MessageService]

})
export class PetitionSentComponent implements OnInit{ 

    //Lista de peticiones
    petitions: Petition[];

    //Columnas de la tabla
    cols: any[];

    //Estados de la petición para el filtrado
    statuses: any[];

    //representa 
    displayCancelConfirmation: boolean;

    //Identificador de la petición que se va a cancelar
    private petition : Petition;

    //Identifica si la vista es para peticiones enviadas o recibidas
    petitionSent: boolean = true;

    //Alertas
    msgs: Message[];

    constructor(
        private petitionService: PetitionService,
        private translate: TranslateService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.petitionService.getPetitionsSent()
            .then(petitions => this.petitions = this.parserDate(petitions));
            
        this.cols = [
            { field: 'mail', header: 'mail', width: '15%' },
            { field: 'title', header: 'titleExperiment', width: '20%' },
            { field: 'description', header: 'descriptionExperiment', width: '20%' },
            { field: 'formatDate', header: 'shippingDate', width: '14.5%'},
            { field: 'statusPetition', header: 'statePetition', width: '13%' },
            { field: 'manager', header: 'rol', width: '12%' },
            { field: 'actions', header: 'actions', width: '5,5%' }
        ];

        this.statuses = [
            {label: 'PENDING', value: 'PENDING'},
            {label: 'ACCEPTED', value: 'ACCEPTED'},
            {label: 'REJECTED', value: 'REJECTED'},
            {label: 'CANCELLED', value: 'CANCELLED'}
        ]
    }

    /**
     * Realiza la cancelación de una petición
     * @param petition 
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
