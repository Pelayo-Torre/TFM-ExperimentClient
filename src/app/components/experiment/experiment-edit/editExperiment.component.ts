import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Experiment } from '../model/experiment';
import { ExperimentService } from '../experiment.service';
import { ExperimentDataService } from '../experiment-data.service';
import { Message } from 'primeng/api';
import {MessageService} from 'primeng/api';
import { Identifier } from '../../shared/model/identifier';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { DemographicData, TypeDemographicData } from '../model/demographicData';
import { saveAs } from 'file-saver';


@Component({
    selector: 'edit-experiment',
    templateUrl: './editExperiment.component.html',
    styleUrls: ['./editExperiment.component.css' ,'../../shared/common-style.css'],
    providers: [MessageService]
})
export class EditExperimentComponent implements OnInit{

    //Experimento en cuestión
    @Input("idExperiment") idExperiment : number;

    //Formulario de edición de un experimento
    updateExperiment: FormGroup; 

    //Variable booleana que indica si el usuario está editando o no el experimento
    updating: boolean;

    //Representa el experimento actual
    experiment: Experiment;

    //Alertas
    msgs: Message[];
 
    selectedAction: string;
    //actions: string [] = [];

    actions = []; 
    
    //Tipos de campos tipo valor
    dataTypes = []

    manager: boolean;

    //Se utiliza para mostrar la ventana modal de confirmar cambio de estado
    displayModalOpenExperiment: boolean;

    constructor(
        private experimentService: ExperimentService,
        private experimentDataService: ExperimentDataService,
        private translate: TranslateService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private router : Router,
        private session : SessionStorageService
    ){
        this.updateExperiment = this.fb.group({
            title : ['', [Validators.required]],
            description : ['', [Validators.required]],
            demographicData : new FormArray([])
        });

        this.experiment = new Experiment();
        this.updating = false;
        this.displayModalOpenExperiment = false;
        this.dataTypes = []
    }

    ngOnInit() {
        //Se cargan las notas del experimento
        this.loadExperimentData();
        //Se cargan los posibles tipos de datos demográficos
        this.experimentService.getAllTypes()
            .then(types => this.parserType(types));
    }

    parserType(types: TypeDemographicData[]){
        types.forEach(type => {
            this.translate.get('experiment.register.' + type['type']).subscribe((data:any)=> {
                this.dataTypes.push({label: data, value: type['type']});
            });
        });
    }

    ngDoCheck(){
        if(this.selectedAction != null || this.selectedAction != undefined){
            //Se realiza la acción pertinente
            if(this.selectedAction['name'] === 'OPEN'){
                this.displayModalOpenExperiment = true;
            }
            else if(this.selectedAction['name'] === 'CLOSE'){
                this.close();
            }
            else if(this.selectedAction['name'] === 'DELETE'){
                this.delete();
            }
            else if(this.selectedAction['name'] === 'REOPEN'){
                this.reopen();
            }
            this.selectedAction = undefined;
        }
        
    }

    /** 
     * Carga los datos del experimento
     */
    private loadExperimentData(){
        var resObs = this.experimentService.detail(this.idExperiment);
        resObs.subscribe(
            res => {
                //Se cargan los datos en el formulario
                this.updateExperiment = this.fb.group({
                    title: [res['title'], [Validators.required]],
                    description: [res['description'], [Validators.required]],
                    demographicData : new FormArray([])
                });
                //Actualizamos el estado del investigador sobre el investigador en sessionStorage
                let investigator = this.session.get("investigator");
                investigator.manager = res['isManagerInvestigatorInSession'];
                this.session.set("investigator", investigator);
                this.manager = investigator.manager;
                //Rellenamos el experimento con los datos que nos vienen en la response
                this.createExperiment(res);
                this.loadActions();
            },
            err => {
                this.translate.get('experiment.edit.loadDataErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        );
    }

    /**
     * Crea un objeto experimento a partir de los datos del detalle del servicio
     * @param experiment datos devueltos por el servicio
     */
    private createExperiment(experiment: any){
        this.experiment.title = experiment['title'];
        this.experiment.description = experiment['description'];
        this.experiment.creationDate = experiment['creationDate'];
        this.experiment.id = experiment['id'];
        this.experiment.status = experiment['status'];
        this.experiment.mailInvestigator = experiment['mailInvestigator'];
        this.experiment.nameInvestigator = experiment['nameInvestigator'];
        this.experiment.surnameInvestigator = experiment['surnameInvestigator'];

        this.experiment.demographicData = [];
        for(let i = 0; i<experiment['demographicData'].length; i++){
            this.demographicData.push(this.createDemographicData(
                experiment['demographicData'][i].name, 
                experiment['demographicData'][i].type)) ;
            this.experiment.demographicData.push(
                new DemographicData(experiment['demographicData'][i].name, 
                    experiment['demographicData'][i].type));
        }
    }

    public get demographicData(){
        return this.updateExperiment.get('demographicData') as FormArray;
    }

    /**
     * Añade un nuevo par de input-combo para crear un dato demográfico
     * @param type  tipo de dato
     * @param index  posición en la que se insertará
     */
    public addDemographicData(type: string, index: number) {
        if(type === undefined || type === null){
            if(index === undefined || index === null){
                this.demographicData.push(this.createDemographicData(null, 'STRING')) ;
            }
            else{
                this.demographicData.insert(index, this.createDemographicData(null, 'STRING')) ;
            }
        }
        else{
            if(index === undefined || index === null){
                this.demographicData.push(this.createDemographicData(null, type));
            }
            else{
                this.demographicData.insert(index, this.createDemographicData(null, type)) ;
            }
        }
            
    }

    /**
     * Crea una nueva opción para añadir un par valor-tipo
     * @returns la opción
     */
    private createDemographicData(value: string, type: string) : FormGroup{
        if(value != null){
            return this.fb.group({
                name: [value, [Validators.required]],
                type: [type]
            })
        }
        return this.fb.group({
            name: ['', [Validators.required]],
            type: [type]
        })
    }

    /**
     * Elimina un dato demográfico
     * @param i posición del dato a eliminar
     */
    deleteDemographicData(i: number){
        this.demographicData.removeAt(i) ;
    }

    /**
     * Carga las acciones a realizar en función del estado del experimento
     */
    private loadActions(){
        if(this.experiment.status === 'CREATED'){
            this.actions = [ 
                {name: 'OPEN', code: 'OPEN'}, 
                {name: 'DELETE', code: 'DELETED'}
            ];
        }
        else if(this.experiment.status === 'OPEN'){
            this.actions = [ 
                {name: 'CLOSE', code: 'CLOSED'}
            ]; 
        }
        else if(this.experiment.status === 'CLOSED'){
            this.actions = [ 
                {name: 'REOPEN', code: 'OPEN'}, 
                {name: 'DELETE', code: 'DELETED'}
            ];
        }
    } 

    //Realiza la actualización de los datos del experimento
    public update(){
        //Cogemos los datos del formulario
        this.experiment.title = this.updateExperiment.value.title;
        this.experiment.description = this.updateExperiment.value.description;
        this.experiment.demographicData = this.updateExperiment.value.demographicData;
        var resObs = this.experimentService.update(this.experiment);
        resObs.subscribe(
            res => {
                //Desactivamos el modo edición
                this.desactivateEdition();
                //Lanzamos toast de que la edición fue correcta
                this.translate.get('experiment.edit.updateSuccess').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
                this.loadExperimentData();
            },
            err => {
                this.translate.get('experiment.edit.updateErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        );
    }

    /**
     * Realiza la descarga del fichero JS de toma de datos
     */
     public download(){
        var resObs = this.experimentDataService.getScriptFile(this.idExperiment);
        resObs.subscribe(
            blob => {
                saveAs(blob, 'scriptTest.js')
            },
            err => {
                this.translate.get('experiment.downloadErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        );
    }

    public openExperiment(){
        this.displayModalOpenExperiment = false;
        this.open();
    }

    /**
     * Realiza la apertura del experimento.
     */
    public open(){
        let id = new Identifier(this.experiment.id)
        var resObs = this.experimentService.open(id)
        resObs.subscribe(
            res => {
                //Cambiamos el estado del experimento
                this.experiment.status = 'OPEN'
                //Recargamos las acciones en función del nuevo estado
                this.loadActions();
                //Lanzamos toast de que la edición fue correcta
                this.translate.get('experiment.open').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('experiment.openErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        );
    }

    /**
     * Realiza la eliminación del experimento
     */
    public delete(){
        let id = new Identifier(this.experiment.id)
        var resObs = this.experimentService.delete(id)
        resObs.subscribe(
            res => {
                //Redirigimos al usuario a la pantalla principal
                this.experimentService.deleted = true;
                this.router.navigate(['/experiments']);
            },
            err => {
                this.translate.get('experiment.deleteErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        );
    }

    /**
     * Realiza el cerrado del experimento.
     */
    public close(){
        let id = new Identifier(this.experiment.id)
        var resObs = this.experimentService.close(id)
        resObs.subscribe(
            res => {
                //Cambiamos el estado del experimento
                this.experiment.status = 'CLOSED'
                //Recargamos las acciones en función del nuevo estado
                this.loadActions();
                //Lanzamos toast de que la edición fue correcta
                this.translate.get('experiment.close').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('experiment.closeErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        );
    }

      /**
     * Realiza la apertura del experimento.
     */
    public reopen(){
        let id = new Identifier(this.experiment.id)
        var resObs = this.experimentService.reOpen(id)
        resObs.subscribe(
            res => {
                //Cambiamos el estado del experimento
                this.experiment.status = 'OPEN'
                //Recargamos las acciones en función del nuevo estado
                this.loadActions();
                //Lanzamos toast de que la edición fue correcta
                this.translate.get('experiment.reopen').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('experiment.reopenErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        );
    }

    /**
     * Activa la edición de los datos del experimento
     */
    public activateEdition(){
        this.updating = true;
    }

    /**
     * Desactiva la edición de los datos del experimeto
     */
    public desactivateEdition(){
        this.updating = false;
        this.updateExperiment = this.fb.group({
            title: [this.experiment.title, [Validators.required]],
            description: [this.experiment.description, [Validators.required]]
        });
    }

    /**
     * Mostrar alertas en pantalla
     */
    public show(sever: string, summ: string, info: string) {
        this.messageService.add({severity: sever, summary: summ, detail: info});
    }

    

}