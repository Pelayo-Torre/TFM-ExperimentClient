import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'DetailExperimentComponent',
    templateUrl: './detailExperiment.component.html',
    styleUrls: ['./detailExperiment.component.css' ,'../../shared/common-style.css']
})
export class DetailExperimentComponent implements OnInit{
    
    //Identificador del experimento del detalle
    public idExperiment: number;

    constructor(
        private route: ActivatedRoute,
    ){}
 
    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
			let id = params['id'];
			this.idExperiment = id;
		});
    }

}
