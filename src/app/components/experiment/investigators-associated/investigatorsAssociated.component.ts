import {Component, OnInit, Input } from '@angular/core';
import { ExperimentService } from '../experiment.service'
import { TranslateService } from '@ngx-translate/core';
import { Investigator } from '../../investigator/model/investigator';
import { PetitionService } from '../../petition/petition.service'
import { Petition } from '../../petition/model/petition';
import { Message } from 'primeng/api';
import {MessageService} from 'primeng/api';
import { SessionStorageService } from 'angular-web-storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'investigators-associated',
  templateUrl: './investigatorAssociated.component.html',
  styleUrls: ['./investigatorAssociated.component.css' , '../../shared/common-style.css'],
  providers: [MessageService]

})
export class InvestigatorsAssociatedComponent implements OnInit{ 

    //Experimento en cuestión
    @Input("idExperiment") idExperiment : number;

    //Formulario de nueva invitación
    public registerPetition: FormGroup; 

    //Lista de investigadores que pueden ser asociados al experimento en cuestión
    investigatorsNotAssociated : Investigator[] = []

    //Sirve para mostrar/ocultar la lista de investigadores no asociados al experimento
    displayModalNewAssociation: boolean;

    //Sirve para mostrar/ocultar la ventana modal de confirmación de asociación
    displayModalConfirmAssociation: boolean;

    //Sirve para mostrar la ventana modal de cancelar la asociación de un investigador-experimento
    displayModalCancelAssociation: boolean;

    //Alertas
    msgs: Message[]; 

    //Variable para saber si ya se ha mandado una petición a ese investigador
    petitionAlreadyExist: boolean;

    //Lista de investigadores
    investigators: Investigator[] = [];

    //Identifica si el investigador en sesión es o no gestor del experimento
    manager: boolean;

    //Id del investigador que se ha elegido para llevar a cabo la cancelación de la asociación
    private idInvestigatorToCancel: number;

    //Columnas de la tabla de investigadores
    cols: any[];

    constructor(
        private experimentService: ExperimentService,
        private translate: TranslateService,
        private petitionService: PetitionService,
        private messageService: MessageService,
        private session : SessionStorageService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        
        this.loadInvestigatorsAssociated();

        this.cols = [
            { id: 1, field: 'name', header: 'name', width: '20%' },
            { id: 2, field: 'mail', header: 'mail', width: '45%' },
            { id: 3, field: 'manager', header: 'rol', width: '20%' },
            { id: 4, field: 'cancel', header: 'cancelAssociation', width: '15%' }
        ];

        this.petitionAlreadyExist = false;

        this.registerPetition = this.fb.group({
            mail: ['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
            gestor : []
        });
    }

    ngDoCheck(){
        let investigator = this.session.get("investigator");
        this.manager = investigator.manager;
    }

    private loadInvestigatorsAssociated(){
        this.experimentService.getInvestigatorsOfExperiment(this.idExperiment)
            .then(investigators => this.investigators = investigators);
    }

    /**
     * Cancela la asociación de un investigador con el experimento
     * @param investigator 
     */
    public showModalCancelAssociation(investigator: Investigator){
        this.idInvestigatorToCancel = investigator.id;
        this.displayModalCancelAssociation = true;
    }

    /**
     * Muestra la ventana modal de añadir investigadores al experimento
     */
    public showModalInvestigators(){
        this.displayModalNewAssociation = true;
        this.petitionAlreadyExist = false;
        this.registerPetition = this.fb.group({
            mail: ['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
            gestor : []
        });
    }

    /**
     * Oculta la ventana modal de añadir investigadores al experimento
     */
    public hideModalInvestigators(){
        this.displayModalNewAssociation = false;
    }

    /**
     * Muestra la ventana de confirmación de envío de envío de asociación
     * @param id identificar del investigador que se va a asociar
     */
    public showModalConfirmAssociation(){
        this.displayModalConfirmAssociation = true;
    }

    /**
     * Cierra la ventana de confirmación de envío de asociación
     */
    public cancelModalConfirmAssociation(){
        this.displayModalConfirmAssociation = false;
    }

    /**
     * Confirma la asociación 
     */
    public register(){
        //Se lleva a cabo la creación de la petición correspondiente
        var resObs = this.petitionService.register(this.createPetition());
        this.petitionAlreadyExist = false;
        resObs.subscribe(
            res => {
                //Se cierra la ventana modal de confirmación
                this.hideModalInvestigators();
                //Se muestra un mensaje en pantalla indicando que la petición ha sido creada correctamente
                this.translate.get('experiment.investigatorsAssociated.associationSuccess').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                if(err.error.message === '304'){
                    this.petitionAlreadyExist = true;
                }
                else{
                    this.translate.get('experiment.investigatorsAssociated.associationErr').subscribe((data:any)=> {
                        this.show('error', 'Error', data);
                    });
                }
            }
        );
    }

    /**
     * Crea un objeto petición con los datos de la petición correspondiente
     */
    private createPetition(): Petition{
        let petition = new Petition();
        petition.idExperiment = this.idExperiment;
        petition.mail = this.registerPetition.value.mail;

        if(this.registerPetition.value.gestor != undefined &&
            this.registerPetition.value.gestor != null){
            petition.manager = true;
        }
        else{
            petition.manager = false;
        }
        return petition;
    }

    /**
     * Mostrar alertas en pantalla
     */
    public show(sever: string, summ: string, info: string) {
        this.messageService.add({severity: sever, summary: summ, detail: info});
    }

    public cancelAssociation(){
        let petition = new Petition();
        petition.idExperiment = this.idExperiment;
        petition.idInvestigator = this.idInvestigatorToCancel;
        var resObs = this.petitionService.cancelAssociation(petition);
        console.log(petition)
        resObs.subscribe(
            res => {
                //Se actualiza la lista de investigadores asociados y no asociados
                this.loadInvestigatorsAssociated();
                 //Se cierra la ventana modal
                this.displayModalCancelAssociation = false;
                //Se muestra un mensaje de confirmación
                this.translate.get('experiment.investigatorsAssociated.cancelAssociationOk').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                console.log(err)
                this.translate.get('experiment.investigatorsAssociated.cancelAssociationKo').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        )
    }

}
