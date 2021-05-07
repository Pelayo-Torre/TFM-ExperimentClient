import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TokenService } from '../../login/login-files/token.service'
import { SessionStorageService } from 'angular-web-storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Investigator } from '../../investigator/model/investigator';
import { InvestigatorService } from '../../investigator/investigator.service'
import { AdministrationService } from '../../administration/administrator.service'
import { Request } from '../../administration/model/request.component'
import {MessageService} from 'primeng/api';

@Component({
    selector: 'custom-menu-component',
    templateUrl: './custom.menu.component.html',
    styleUrls: ['./custom.menu.component.css', '../../../app.component.css', '../common-style.css'],
    providers: [MessageService]
})
export class CustomMenuComponent implements OnInit {

    public activeLang = 'es';
    public userInSession: Boolean = false;

    //Formulario de edición de un investigador
    updateInvestigator: FormGroup; 

    //Investigador en cuestión
    investigator: Investigator;

    //Variable utilizada para mostrar la ventana modal del perfil del usuario en sesión
    displayModalProfile: boolean;

    //Variable que se emplea para saber si se está editando o no los datos
    updating: Boolean;

    //Variable de existencia de mail
    mailAlreadyExist: boolean;
 
    constructor(
        private translate: TranslateService,
        private tokenService : TokenService,
        private investigatorService: InvestigatorService,
        private session: SessionStorageService,
        private administrationService: AdministrationService,
        private messageService: MessageService,
        private fb: FormBuilder    ) 
    {
        this.translate.setDefaultLang(this.activeLang);
        this.updateInvestigator = this.fb.group({
            name: ['', [Validators.required]],
            surname: ['', [Validators.required]],
            mail: ['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
        });
        this.displayModalProfile = false;
        this.updating = false;
        this.mailAlreadyExist = false;
    }

    ngOnInit() {
        
    }

    ngDoCheck() {
        if(this.session.get("investigator") != null || this.session.get("investigator") != undefined){
            this.userInSession = true;
            this.investigator =  this.session.get("investigator");
        }
        else{
            this.userInSession = false;
        }
    }

    public showModalProfile(){
        this.displayModalProfile = true;
        this.updating = false;
    }

    /**
     * Activa la edición de los datos personales del usuario
     */
    public activateEdition(){
        //Se recuperan los datos de sesión
        let investigator = this.session.get("investigator");
        if(investigator != null && investigator != undefined){
            this.updateInvestigator = this.fb.group({
                name: [investigator.name, [Validators.required]],
                surname: [investigator.surname, [Validators.required]],
                mail: [investigator.mail, [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
            });
        }
        this.updating = true;
        this.mailAlreadyExist = false;
    }

    /**
     * Desactiva la edición de los datos personales del usuairo
     */
    public desactivateEdition(){
        this.updating = false;
    }

    /**
     * Realiza la actualización de los datos de un investigador
     */
    public update(){
        this.mailAlreadyExist = false;
        //Cogemos los datos del investigador
        let investigator = this.createInvestigator();

        var resObs = this.investigatorService.updateInvestigator(investigator);
        resObs.subscribe(
            res => {
                this.updating = false;
                this.session.set("investigator", investigator);
                this.translate.get('menu.profile.updateOk').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                if(err.error.message === '204'){
                    this.mailAlreadyExist = true;
                }else{
                    this.translate.get('menu.profile.updateNok').subscribe((data:any)=> {
                        this.show('error', 'Error', data);
                    });
                }
            }
        );
    }

    /**
     * Realiza la petición para cambiar el rol del investigador
     */
    public sendRequestChangeRol(){
        let request = new Request();
        request.idInvestigator = this.investigator.id;
        var resObs = this.administrationService.register(request);
        resObs.subscribe(
            res => {
                let investigator = this.session.get("investigator");
                investigator.requestPending = true;
                this.session.set("investigator", investigator);

                this.translate.get('menu.request.sendOk').subscribe((data:any)=> {
                    this.show('success', 'Success', data);
                });
            },
            err => {
                this.translate.get('menu.request.sendKo').subscribe((data:any)=> {
                    this.show('error', 'Error', data);
                });
            }
        );
    }

    private createInvestigator(): Investigator{
        let investigator = this.session.get("investigator");

        investigator.name = this.updateInvestigator.value.name;
        investigator.surname = this.updateInvestigator.value.surname;
        investigator.mail = this.updateInvestigator.value.mail;
        
        return investigator;
    }

    /**
     * Realiza el cambio de lenguaje de la aplicación
     * @param lang Nuevo lenguaje
     */
    public changeLanguaje(lang) {
        this.activeLang = lang;
        this.translate.use(lang);
    }

    /**
     * Cierra la sesión del usuario
     */
    public logout() {
        this.tokenService.out();
        this.session.clear();
    }

    /**
     * Mostrar alertas en pantalla
     */
    public show(sever: string, summ: string, info: string) {
        this.messageService.add({severity: sever, summary: summ, detail: info});
    }

}