import {Component, OnInit } from '@angular/core';
import { InvestigatorService } from '../../investigator/investigator.service'
import { ExperimentService } from '../experiment.service'
import { TranslateService } from '@ngx-translate/core';
import { Experiment } from '../model/experiment';
import { Message } from 'primeng/api';
import { SessionStorageService } from 'angular-web-storage';
import { ActivatedRoute, Params } from '@angular/router';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './listExperiments.component.html',
  styleUrls: ['./listExperiment.component.css' , '../../shared/common-style.css'],
  providers: []

})
export class ListExperimentComponent implements OnInit{ 

    experiments: Experiment[];

    cols: any[];

    statuses: any[];

    //Alertas
    msgs: Message[];

    //breadcrumb
    items: MenuItem[];

    home: MenuItem;

    constructor(
        private investigatorService: InvestigatorService,
        private experimentService: ExperimentService,
        private translate: TranslateService,
        private session: SessionStorageService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.route.queryParams.subscribe((params: Params) => {
			this.parserError(params['err']);
		});

        this.investigatorService.getExperimentsAcceptedByInvestigator(this.session.get("investigator")['id'])
            .then(experiments => this.experiments = this.parserDate(experiments));
            

        this.cols = [
            { id: 1, field: 'title', header: 'titleExperiment', width: '22.5%' },
            { id: 2, field: 'description', header: 'description', width: '42.5%' },
            { id: 3, field: 'formatDate', header: 'creationDate', width: '17.5%'},
            { id: 4, field: 'status', header: 'state', width: '17.5%' },
        ]; 

        this.statuses = [
            {label: 'created', value: 'CREATED'},
            {label: 'open', value: 'OPEN'},
            {label: 'closed', value: 'CLOSED'}
        ]


        this.home = {icon: 'pi pi-home'};
    }

    ngDoCheck(){
        if (this.experimentService.experimentCreated) {
            this.experimentService.experimentCreated = false;
            this.translate.get('experiment.register.registerSuccess').subscribe((data:any)=> {
                this.show(data, 'success');
            });
            setTimeout(() => this.hide(), 5000);
        }
        
        if(this.experimentService.deleted){
            this.experimentService.deleted = false;
            this.translate.get('experiment.delete').subscribe((data:any)=> {
                this.show(data, 'success');
            });
            setTimeout(() => this.hide(), 5000);
        }
    }

    private parserError(error){
        if(error === '403'){
            console.log("fff")
            this.translate.get('errors.403').subscribe((data:any)=> {
                this.show(data, 'error');
            });
        }
    }

    /**
     * Parsea las fechas de creación de los experientos 
     * @param experiments lista de experimentos
     */
    parserDate(experiments: Experiment[]) : Experiment[]{
        console.log(experiments)
        experiments.forEach(experiment => {
            let date = new Date(experiment.creationDate);
            experiment.formatDate = this.parserNumber(date.getDate()) + 
            "/" + this.parserNumber((date.getMonth()+1)) + "/" + this.parserNumber(date.getFullYear())
        });
        return experiments;
    }

    /**
     * Parsea un número si solo tiene un dígito
     * @param num 
     */
    parserNumber(num: number){
        if(num.toString().length == 1){
            return "0" + num;
        }
        return num;
    }

    /**
     * Mostrar alertas en pantalla
     */
    show(info: string, sever: string) {
        this.msgs = [{severity: sever, summary:'Message', detail: info}];
    }

    /**
     * Limpia los mensajes del array
     */
    hide() {
        this.msgs = [];
    }

}
