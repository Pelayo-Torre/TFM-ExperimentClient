import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {MessageService} from 'primeng/api';
import { ExperimentDataService } from '../../experiment-data.service';
import { EventDTO } from '../../model/event';

@Component({
    selector: 'experiment-data-trace-component',
    templateUrl: './experiment-data-trace.component.html',
    styleUrls: ['./experiment-data-trace.component.css'],
    providers: [MessageService]
})
export class ExperimentDataTraceComponent implements OnInit{

    @Input("idExperiment") idExperiment : number;

    @Input("user") user : string;

    @Input("scene") scene : string;

    @ViewChild('canvas', { static: true }) 
    canvas: ElementRef<HTMLCanvasElement>;

    //Lista de eventos a pintar
    private events : EventDTO[] ;

    private ctx: CanvasRenderingContext2D;

    constructor(
        private messageService: MessageService,
        private experimentDataService: ExperimentDataService,
    ){
        this.events = [];
    }

    ngOnInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.getEvents();
    }

    /**
     * Realiza la petición al servidor para obtener la lista de eventos
     */
    private getEvents(){
        this.experimentDataService.getEvents(this.idExperiment, this.scene, this.user)
        .then(result => {
            this.events = result;
            this.showTrace();
        })
        .catch(err => {
            console.log(err)
        });
    }


    /**
     * Método que invoca 
     * @param user 
     */
     private showTrace(){
        this.ctx.beginPath(); 
        let initial: boolean = false;
        this.events.forEach(event => {
           if(event.eventType === 0){
                if(!initial){
                    this.ctx.moveTo(event.x, event.y); 
                    console.log(event)
                    initial = true; 
                }
                else{
                    this.ctx.lineTo(event.x, event.y);
                }
            }
            else if(event.eventType === 1){
                if(!initial){
                    this.ctx.moveTo(event.x, event.y); 
                    initial = true; 
                }
                console.log(event)
                this.ctx.fillStyle = 'red';
                this.ctx.fillRect(event.x, event.y, 10, 10);
            }
            else if(event.eventType === 2){
                if(!initial){
                    this.ctx.moveTo(event.x, event.y); 
                    initial = true; 
                }
                this.ctx.fillStyle = 'blue';
                this.ctx.fillRect(event.x, event.y, 10, 10);
            }
        });
        this.ctx.stroke();     
    }


}