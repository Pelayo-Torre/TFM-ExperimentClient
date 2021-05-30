import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Note } from '../model/note'
import { BinnacleService } from '../binnacle.service';
import { ExperimentService } from '../../experiment.service';
import { Identifier } from '../../../shared/model/identifier';
import {MessageService} from 'primeng/api';


@Component({
    selector: 'binnacle-experiment',
    templateUrl: './binnacleExperiment.component.html',
    styleUrls: ['./binnacleExperiment.component.css' ,'../../../shared/common-style.css'],
    providers: [MessageService]
})

export class BinnacleComponent implements OnInit{

    //Formulario de registro de una nota
    public registerNote: FormGroup; 

    //Lista de notas de la bitácora del experimento
    public notes: Note [] = [];

    //Nueva nota que se va añadir a la bitácora
    public note: Note;

    //Identificador del experimento en cuestión
    @Input("idExperiment") idExperiment : number;

    //Columnas de la tabla donde se almacenanrán las notas
    cols: any[];

    //Ventana modal de crear nota
    displayModalNote: boolean;

    //Ventana modal dialog para la confirmación de la eliminación de una nota de la bitácora
    displayDeleteConfirmation: boolean;

    //Variable booleana que representa si el investigador se encuentra editando una nota
    updating: boolean;

    //Nota que va a ser eliminada o editada
    private noteAction: Note;

    //Título de la ventana modal
    titleModalEditRegister: string;

    //Alertas
    msgs: Message[];

    constructor(
        private translate: TranslateService,
        private fb: FormBuilder,
        private binnacleService: BinnacleService,
        private experimentService: ExperimentService,
        private messageService: MessageService
    ){
        
        this.registerNote = this.fb.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]]
        });

        this.cols = [
            { field: 'note', header: 'note', width: '100%' }
        ];
    }

    ngOnInit() {
        //Se cargan las notas del experimento
        this.getNotes();
    }

    ngDoCheck(){
        if(this.experimentService.isStatusChanged === true){
            this.getNotes();
            this.experimentService.isStatusChanged = false;
        }
    }

    /**
     * Realiza una llamada al servicio para onbtener la lista de notas de la bitácora
     */
    private getNotes(){
        
        this.binnacleService.getNotes(this.idExperiment)
            .then(notes => this.notes = notes);
        
    }

    /**
     * Rellena un objeto con los datos del formulario de la nota para enviarlos al servidor
     */
    private fillNote(note: Note){
        note.title = this.registerNote.value.title;
        note.description = this.registerNote.value.description;
        note.idExperiment = this.idExperiment;
    }

    /**
     * Invoca al registro o a la edición dependiendo de la variable de control
     */
    public actionNote(){ 
        if(this.updating){
            this.update();
        }
        else{
            this.register();
        }
    }

    /**
     * Realiza el registro de una nota. Para ello, envía una petición al servidor y trata la respuesta obtenida
     */
    private register(){
        this.note = new Note();
        this.fillNote(this.note);
        var resObs = this.binnacleService.register(this.note);
        resObs.subscribe(
            res => {
                //Se obtiene la lista de notas
                this.getNotes();
                //Se cierra la ventana modal
                this.displayModalNote = false;
                this.translate.get('experiment.binnacle.registerNote.registerSuccess').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('experiment.binnacle.registerNote.registerErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
                //Se cierra la ventana modal
                this.displayModalNote = false;
            }
        );
    }

    /**
     * Actualiza los datos de una nota de la bitácora
     */
    private update(){
        this.fillNote(this.noteAction);
        var resObs = this.binnacleService.update(this.noteAction);
        resObs.subscribe(
            res => {
                //Obtenemos la lista de notas
                this.getNotes();
                //Se cierra la ventana modal
                this.displayModalNote = false;
                //Se cancela la edición
                this.updating = false;
                this.translate.get('experiment.binnacle.updateNote.updateSuccess').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('experiment.binnacle.updateNote.updateErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
                //Se cierra la ventana modal
                this.displayModalNote = false;
            }
        );
    }

    /**
     * Elimina una nota de la bitácora
     */
    public delete(){
        let identifier = new Identifier(this.noteAction.id);
        var resObs = this.binnacleService.delete(identifier);
        resObs.subscribe(
            res => {
                //Se obtiene la lista de notas
                this.getNotes();
                //Se cierra la ventana modal
                this.displayDeleteConfirmation = false;
                this.translate.get('experiment.binnacle.deleteNote.deleteSuccess').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('experiment.binnacle.deleteNote.deleteErr').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
                //Se cierra la ventana modal
                this.displayDeleteConfirmation = false;
            }
        );
    }

    /**
     * Muestra la ventana modal de confirmación de eliminación de una nota en la bitácora. 
     * Además, recibe la nota que va a eliminar y la guarda en contexto.
     * @param note 
     */
    public showModalDeleteNote(note: Note){
        this.noteAction = note;
        this.displayDeleteConfirmation = true;
    }

     /**
     * Muestra la ventana modal edición de una nota en la bitácora. 
     * Rellena los datos del formulario con los de la nota que se va a editar
     * Además, recibe la nota que va a editar y la guarda en contexto.
     */
    public showModalEditNote(note: Note){
        this.noteAction = note;
        this.translate.get('experiment.binnacle.updateNote.title').subscribe((data:any)=> {
            this.titleModalEditRegister =  data;
        });
        this.updating = true;
        this.registerNote = this.fb.group({
            title: [note.title, [Validators.required]],
            description: [note.description, [Validators.required]]
        });
        this.displayModalNote = true;
    }

    /**
     * Despliega una ventana modal para el registro de una nota en la bitácora del experimento
     */
    public showModalNote() {
        this.displayModalNote = true;
        this.translate.get('experiment.binnacle.registerNote.title').subscribe((data:any)=> {
            this.titleModalEditRegister =  data;
        });
        this.registerNote = this.fb.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]]
        });
    }

    /**
     * Mostrar alertas en pantalla
     */
    public show(sever: string, summ: string, info: string) {
        this.messageService.add({severity: sever, summary: summ, detail: info});
    }

}
