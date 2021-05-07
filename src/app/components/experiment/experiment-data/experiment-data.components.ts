import { Component, OnInit, ViewChild, ElementRef,  } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ExperimentDataService } from '../experiment-data.service';
import { ExperimentService } from '../experiment.service';
import { CalculateData } from '../model/calculateData';
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { User } from '../model/user';
import { Strategy } from '../model/strategy';
import { Scene } from '../model/scene';
import { ExportToCsv } from 'export-to-csv';
import { Header, Result } from '../model/tableData';
import { DemographicDataDTO } from '../model/demographicData';
import { Filter } from '../model/filter';
import { Experiment } from '../model/experiment';

@Component({
    selector: 'ExperimentDataComponent',
    templateUrl: './experiment-data.component.html',
    styleUrls: ['./experiment-data.component.css' ,'../../shared/common-style.css'],
    providers: [MessageService]
})
export class ExperimentDataComponent implements OnInit{

    //Identificador del experimento del cálculo de datos
    public idExperiment: number;

    private experiment: Experiment;

    //Resultados de los cálculos iniciales
    public result: Map<String, any []>;

    //Identificador de la escena
    public sceneID: String;

    //Identificador del usuario seleccionado
    public user: string;

    //Se utiliza para mostrar la traza del usuario
    public showTrace: boolean;

    //Lista de usuarios que participan en el experimento
    public users: User [];

    //Lista de todos los cálculos a realizar
    public strategies: Strategy [];

    //Lista de todos los filtros a realizar
    public filters : Filter [];

    //Lista de escenas registradas en el experimento
    public scenes: Scene [];

    //Lista de los usuarios seleccionados para visualización de datos
    public selectedUsers: String [];
    public selectedUsersAll: String [];

    //Lista de calculados a realizar seleccionados
    public selectedStrategies : String [];
    public selectedStrategiesAll : String [];

    //Lista de filtros a aplicar
    public selectedFilters: String[];
    public selectedFiltersAll: String [];

    //Lista de cabeceraas de la tabla para exportación
    public headers: string[];

    //Listas para la construcción de la tabla de muestra de datos
    public headers2: Header [];
    public result2 : Map<string, Result []>;

    //Lista de elementos que aparecen en la tabla de muestra de datos
    public leyenda: String[];

    public demographicData: DemographicDataDTO [];

    //Representa si los datos están o no calculados
    public isCalculate: Boolean;

    //Mostrar la barra de carga
    public showLoadData: Boolean;

    //Activar o desactivar el botón de realizar los cálculos
    public activateData: Boolean;

    //Datos que van a ser exportados en CSV
    public dataExport: any [];

    //Se utiliza para seleccionar o no todos los usuarios
    public selectAllUsers: Boolean;

    //Se utiliza para seleccionar o no todas las estrategias
    public selectAllStrategies: Boolean;

    //Se utiliza para seleccionar o no todos los filtros
    public selectAllFilters: Boolean;
 
    //Alertas
    msgs: Message[];

    //Variable que se utiliza para comprobar si hay datos en los cálculos
    hayDatos: boolean;

    constructor( 
        private translate: TranslateService,
        private messageService: MessageService,
        private experimentDataService: ExperimentDataService,
        private experimentService: ExperimentService,
        private route: ActivatedRoute,
    ){ 
        this.users = [];
        this.headers = [];
        this.result = new Map();
        this.leyenda = [];
        this.isCalculate = false;
        this.strategies = [];
        this.selectedUsers = [];
        this.selectedStrategies = [];
        this.selectedStrategiesAll = [];
        this.selectedFilters = [];
        this.selectedFiltersAll = [];
        this.selectedUsersAll = [];
        this.scenes = [];
        this.filters = [];
        this.dataExport = [];
        this.showLoadData = false;
        this.activateData = false;
        this.headers2 = [];
        this.result2 = new Map();
        this.demographicData = [];
        this.selectAllFilters = true;
        this.selectAllStrategies = true;
        this.selectAllUsers = true;
        this.showTrace = false;
        this.experiment = new Experiment();
        this.hayDatos = false;
    }
 
    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
			let id = params['id'];
			this.idExperiment = id;
            this.getExperiment();
            this.getStrategies();
            this.getUsers();
            this.getScenes();
            this.getFilters();
		});
    }

    ngDoCheck(){
        if(this.selectedUsers.length != 0 && this.selectedStrategies.length != 0 && (this.sceneID != undefined || this.sceneID != null) ){
            this.activateData = true;
        }
        else{
            this.activateData = false;
        }
    }

    /**
     * Registra el evento onChange del checkbox de seleccionar todos los usuarios
     */
     checkStrategies(){
        if(this.selectAllStrategies){
            this.selectedStrategies = this.selectedStrategiesAll;
        }
        else{
            this.selectedStrategies = [];
        }
    }

    /**
     * Registra el evento onChange del checkbox de seleccionar todos los usuarios
     */
    checkUsers(){
        if(this.selectAllUsers){
            this.selectedUsers = this.selectedUsersAll;
        }
        else{
            this.selectedUsers = [];
        }
    }

    /**
     * Registra el evento onChange del chekbox de seleccionar todos los filtros
     */
    checkFilters(){
        if(this.selectAllFilters){
            this.selectedFilters = this.selectedFiltersAll;
        }
        else{
            this.selectedFilters = [];
        }
    }

    /**
     * Realiza los cálculos de los datos seleccionados
     */
    public calculate(){
        let data = new CalculateData();
        data.sceneID = this.sceneID;
        data.users = this.selectedUsers;
        this.selectedStrategies.forEach(element => {
            data.strategys.push(+element);
        });
        this.selectedFilters.forEach(element => {
            data.filters.push(+element);
        });
        
        data.idExperiment = this.idExperiment;
        this.isCalculate = true;
        this.showLoadData = true;
        this.sceneID = data.sceneID;
        this.getDemographicData();

        this.experimentDataService.calculate(data)
            .then(result => {
                this.createTable(result);
                this.showLoadData = false;
            })
            .catch(err => {
                this.showLoadData = false;
                console.log(err)
                this.translate.get('experiment.data.calculateErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            });
    }

    public newCalculate(){
        this.getStrategies();
        this.getUsers();
        this.getScenes();
        this.getFilters();
        this.isCalculate = false;
        this.headers = [];
        this.result = new Map();
        this.headers2 = [];
        this.result2 = new Map();
        this.leyenda = [];
        this.sceneID = null;
        this.dataExport = [];
        this.selectAllStrategies = true;
        this.selectAllUsers = true;
        this.selectAllFilters = true;
        this.hayDatos = false;
    }

    /**
     * Carga los datos del experimento.
     */
    private getExperiment(){
        let resObs = this.experimentService.detail(this.idExperiment) 
        resObs.subscribe(
            res => {
                this.experiment.title = res['title'];
                this.experiment.description = res['description'];
            },
            err => {
                this.translate.get('experiment.edit.loadDataErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        );
    }

    /**
     * Invoca al servicio de obtención de usuarios del experimento
     */
    private getUsers(){
        this.experimentDataService.getUsers(this.idExperiment)
        .then(result => {
            this.users = result;
            this.selectedUsers = [];
            this.users.forEach(user => {
                this.selectedUsers.push(user.sessionId);
                this.selectedUsersAll.push(user.sessionId);
            });
        })
        .catch(err => {
            this.translate.get('experiment.data.usersErr').subscribe((data:any)=> {
                this.show('error', 'Error', data);
            });
        });
    }

    /**
     * Invoca al servicio de obtención de escenas del experimento
     */
     private getScenes(){
        this.experimentDataService.getScenes(this.idExperiment)
        .then(result => {
            this.scenes = result;
        })
        .catch(err => {
            this.translate.get('experiment.data.scenesErr').subscribe((data:any)=> {
                this.show('error', 'Error', data);
            });
        });
    }

    /**
     * Invoca al servicio de obtención de estrategias del experimento
     */
     private getStrategies(){
        this.experimentDataService.getStrategys()
        .then(result => {
            this.strategies = result;
            this.selectedStrategies = [];
            this.strategies.forEach(strategy => {
                this.selectedStrategies.push(strategy.identifier.toString());
                this.selectedStrategiesAll.push(strategy.identifier.toString());
            });
        })
        .catch(err => {
            this.translate.get('experiment.data.strategysErr').subscribe((data:any)=> {
                this.show('error', 'Error', data);
            });
        });
    }

    /**
     * Invoca al servicio de obtención de filtros del experimento
     */
     private getFilters(){
        this.experimentDataService.getFilters()
        .then(result => {
            this.filters = result;
            this.selectedFilters = [];
            this.filters.forEach(filter => {
                this.selectedFilters.push(filter.identifier.toString());
                this.selectedFiltersAll.push(filter.identifier.toString());
            });
        })
        .catch(err => {
            this.translate.get('experiment.data.filtersErr').subscribe((data:any)=> {
                this.show('error', 'Error', data);
            });
        });
    }

    /**
     * Invoca al servicio de obtención de datos demográficos del experimento
     */
     private getDemographicData(){
        this.experimentDataService.getDemographicData(this.idExperiment)
        .then(result => {
            this.demographicData = result;
        })
        .catch(err => {
            this.translate.get('experiment.data.demographicDataErr').subscribe((data:any)=> {
                this.show('error', 'Error', data);
            });
        });
    }

    /**
     * Recorre y crea la tabla que será visualizada en la vista.
     * Además, también crea la leyenda del los campos a mostrar
     * @param data 
     */
    private createTable(data: Map<String, []>){
        data = new Map(Object.entries(data));
        let header: Header [] = [];
        data.forEach((value, key: string) => {
            let headers: any = [];
            let results: Result [] = [];
            value.forEach(element => {
                if(element['result'] != null && element['result'] != undefined){
                    let resu = new Map(Object.entries(element['result']));
                    if(resu.size > 0){
                        //En caso de que vengan componentes en vez de un resultado numérico
                        let cont = 0;
                        resu.forEach((value: number, key)  => {
                            let nameLeyenda :string= "";
                            let abbreviationLeyenda: string = "";
                            this.translate.get('experiment.data.strategys.' + element['identifier']).subscribe(
                                (data:any)=> {nameLeyenda = data;}
                            );
                            this.translate.get('experiment.data.abbreviations.' + element['identifier']).subscribe(
                                (data:any)=> {abbreviationLeyenda = data;}
                            );

                            //Se crea la columna
                            let name: string = abbreviationLeyenda + " - " + key;
                            let id : string = element['identifier'] + key;
                            let strategy: number = element['identifier'];
                            results.push(new Result(id, value));
                            if(!this.containsHeader(id, headers)){
                                headers.push(new Header(name, id, strategy));
                            }
                            if(cont == 0){
                                if(!this.leyenda.includes(abbreviationLeyenda + ": " + nameLeyenda)){
                                    this.leyenda.push(abbreviationLeyenda + ": " + nameLeyenda)
                                }
                            }
                            cont++;
                        });
                    }
                    else{
                        let nameLeyenda : string= "";
                        let abbreviationLeyenda : string= "";
                        this.translate.get('experiment.data.strategys.' + element['identifier']).subscribe(
                            (data:any)=> {nameLeyenda = data;}
                        );
                        this.translate.get('experiment.data.abbreviations.' + element['identifier']).subscribe(
                            (data:any)=> {abbreviationLeyenda = data;}
                        );
                        results.push(new Result(element['identifier'], element['result']));
                        if(!this.containsHeader(element['identifier'], headers)){
                            headers.push(new Header(abbreviationLeyenda, element['identifier'], element['identifier']));
                        }
                        if(!this.leyenda.includes(abbreviationLeyenda + ": " + nameLeyenda))
                            this.leyenda.push(abbreviationLeyenda + ": " + nameLeyenda)
                    }
                }
            });
            this.result2.set(key, results);
            if(header.length <= headers.length){
                header = headers;
            }
        });
        this.demographicData.forEach(dd => {
            let name: string = dd.name;
            let id : string = "0" + (dd.id).toString();
            this.headers2.push(new Header(name, id, null));
            dd.values.forEach(value => {
                let r: Result [] = this.result2.get(value.user)
                if(r != null && r != undefined){
                    if(dd.type === "NUMBER"){
                        r.push(new Result(id, value.numberValue))
                    }
                    else if(dd.type === "STRING"){
                        r.push(new Result(id, value.stringValue))
                    }
                    else{
                        r.push(new Result(id, this.getFormatDate(value.dateValue)))
                    }
                }
            });
        });
        Array.prototype.push.apply(this.headers2, header);
        if(this.result2.size > 0){
            this.hayDatos = true;
        }
        this.createData();
    }

    /**
     * Genera los valores de las celdas de la tabla, así como el los datos del CSV a ser exportados.
     */
    private createData(){
        this.headers.push("User")
        this.result2.forEach((value: Result[], key: string) => {
            let jsonData = {};
            jsonData[0] = key;
            let cells: any [] = [];
            let pos: number = 1;
            this.headers2.forEach(header => {
                let result = this.getResult(value, header.id);
                cells.push(result);
                jsonData[pos] = result;
                this.headers.push(header.name);
                pos++;
            });
            this.result.set(key, cells);
            this.dataExport.push(jsonData);
        });
    }

    /**
     * Devuelve el resultado a partir de la cebecera
     * @param results lista de resultados
     * @param idHeader  identificador de la cabecera
     * @returns el resultado
     */
    private getResult(results :Result [], idHeader: string){
        for(let result of results){
            if(result.id.toString() == idHeader){
                if(typeof result.value === 'object' && result.value !== null){
                    return "-";
                }
                return result.value;
            }
        }
        return '-';
    }

    /**
     * Comprueba si la cabecera está ya añadida a la tabla
     * @param header cabecera a añadir
     * @param headers lista de cabeceras hasta el momento
     * @returns true si está añadida, false en caso contrario
     */
    private containsHeader(header: string, headers: Header []){
        headers.forEach(element => {
            if(element.id === header){
                return true;
            }
        });
        return false;
    }

   /**
    * Realiza la exportación de datos en formato CSV
    */
    public exportData(){
        try{
            let fileName = this.experiment.title + "  " + this.getFormatDate(new Date());
            let h: string [] = [];
            h.push("User");
            this.headers2.forEach(header => {h.push(header.name)});
            const options = { 
                fieldSeparator: ',',
                decimalSeparator: '.',
                showLabels: true, 
                title: 'My Awesome CSV',
                filename: fileName,
                useTextFile: false,
                useBom: true,
                headers: h
            };
            const csvExporter = new ExportToCsv(options);
            csvExporter.generateCsv(this.dataExport);
        } catch (Exception){
            this.translate.get('experiment.data.exportErr').subscribe((data:any)=> {
                this.show('error', 'Error', data);
            });
        }
    }

    /**
     * Realiza el formateo de fecha.
     * @param date fecha a formatear
     * @returns la fecha formatea
     */
    private getFormatDate(date: Date): string{

        try{
            let fecha = new Date(date);
            let day = fecha.getDate()
            let month = fecha.getMonth() + 1
            let year = fecha.getFullYear()

            if(month < 10){
                return `${day}-0${month}-${year}`;
            }
            else{
                return `${day}-${month}-${year}`;
            }
        } catch(Exception){
            return null;
        }
        
    }

    public trace(user:string){
        this.user = user;
        this.showTrace = true;
    }

    /**
     * Mostrar alertas en pantalla
     */
     public show(sever: string, summ: string, info: string) {
        this.messageService.add({severity: sever, summary: summ, detail: info});
    }


}