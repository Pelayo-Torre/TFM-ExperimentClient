import {Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'initial-root',
    templateUrl: './initial.component.html',
    styleUrls: ['./initial.component.css' , '../shared/common-style.css'],
    providers: []
  
})
export class InitialComponent implements OnInit{ 

    constructor( private route: Router){}

    ngOnInit() {}

    register(){
        this.route.navigate(['/investigator/register']);
    }

} 