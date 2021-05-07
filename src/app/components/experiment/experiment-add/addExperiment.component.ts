import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExperimentAdd } from '../model/experimentAdd';
import { ExperimentService } from '../experiment.service';
import { Message } from 'primeng/api';
import { SessionStorageService } from 'angular-web-storage';
import { DemographicData, TypeDemographicData } from '../model/demographicData';


@Component({
    selector: 'AddExperimentComponent',
    templateUrl: './addExperiment.component.html',
    styleUrls: ['./addExperiment.component.css' ,'../../shared/common-style.css']
})
export class AddExperimentComponent implements OnInit{

    public registerExperiment: FormGroup; 

    public experiment: ExperimentAdd;

    //Lista de tipos de datos del experimento
    dataTypes = [];

    //Alertas
    msgs: Message[];

    //fecha de nacimiento errónea
    dateErr: boolean;

    constructor(
        private translate: TranslateService,
        private fb: FormBuilder,
        private router: Router,
        private experimentService: ExperimentService,
        private session: SessionStorageService
    ){ 
        this.experiment = new ExperimentAdd();

        this.registerExperiment = this.fb.group({
            title : ['', [Validators.required]],
            description : ['', [Validators.required]],
            demographicData : new FormArray([])
        });

        this.dateErr = false;

        this.dataTypes = []
    }

    ngOnInit() {
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

    get demographicData(){
        return this.registerExperiment.get('demographicData') as FormArray;
    }

    /**
     * Añade un nuevo par de input-combo para crear un dato demográfico
     * @param type  tipo de dato
     * @param index  posición en la que se insertará
     */
    public addDemographicData(type: string, index: number) {
        if(type === undefined || type === null){
            if(index === undefined || index === null){
                this.demographicData.push(this.createDemographicData('STRING')) ;
            }
            else{
                this.demographicData.insert(index, this.createDemographicData('STRING')) ;
            }
        }
        else{
            if(index === undefined || index === null){
                this.demographicData.push(this.createDemographicData(type));
            }
            else{
                this.demographicData.insert(index, this.createDemographicData(type)) ;
            }
        }
            
    }

    /**
     * Crea una nueva opción para añadir un par valor-tipo
     * @returns la opción
     */
    private createDemographicData(type: string) : FormGroup{
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
     * Crea un objeto con los datos del formulario del experimento para enviarlos al servidor
     */
    private createExperiment(){
        this.experiment.title = this.registerExperiment.value.title;
        this.experiment.description = this.registerExperiment.value.description;
        
        let demographicDataList = [];
        if(this.registerExperiment.value.demographicData != undefined && this.registerExperiment.value.demographicData != null){
           for(let i: number = 0; i < this.registerExperiment.value.demographicData.length; i++){
                demographicDataList.push(new DemographicData(
                   this.registerExperiment.value.demographicData[i].name,
                   this.registerExperiment.value.demographicData[i].type
                ));
           }
        }
        this.experiment.idInvestigator = this.session.get("investigator")['id'];
        this.experiment.demographicData = demographicDataList;
    }

    /**
     * Realiza el registro de un experimento. Para ello, envía una petición al servidor y trata la respuesta obtenida
     */
    register(){ 
        this.dateErr = false;
        this.createExperiment();
        
        var resObs = this.experimentService.register(this.experiment);
        resObs.subscribe(
            res => {
                //El registro fue correcto -- Se redirige a la lista de experimentos del usuario
                this.experimentService.experimentCreated = true;
                this.router.navigate(['experiments/']);
            },
            err => {
                this.translate.get('investigator.register.registerErr').subscribe((data:any)=> {
                    this.show(data);
                });
            }
        );
        
    }

    /**
     * Mostrar alertas en pantalla
     */
    show(info: string) {
        this.msgs = [{severity:'error', summary:'Message', detail: info}];
    }

    /**
     * Limpia los mensajes del array
     */
    hide() {
        this.msgs = [];
    }

}
