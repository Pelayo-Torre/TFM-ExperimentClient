import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvestigatorAdd } from '../model/investigator'
import { InvestigatorService } from '../investigator.service'
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from '../../login/login.service'

@Component({
    selector: 'AddInvestigatorComponent',
    templateUrl: './addInvestigator.component.html',
    styleUrls: ['./addInvestigator.component.css', '../../shared/common-style.css']
})
export class AddInvestigatorComponent {
    
    public registerInvestigator: FormGroup; 

    public investigator: InvestigatorAdd;

    //Atributos de validación
    passwordsIncorrects: Boolean;
    mailAlreadyExist: Boolean;
    usernameAlreadyExist: Boolean;

    //Alertas
    msgs: Message[];

    constructor(
        private fb: FormBuilder,
        private investigatorService: InvestigatorService,
        private translate: TranslateService,
        private router: Router,
        private loginService: LoginService
    ){
        this.registerInvestigator = this.fb.group({
            name: ['', [Validators.required]],
			surname: ['', [Validators.required]],
            mail: ['', [Validators.required, Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            repeatPassword: ['', [Validators.required, Validators.minLength(8)]],
        });
        this.investigator = new InvestigatorAdd();
        this.passwordsIncorrects = false;
        this.mailAlreadyExist = false;
    }

    /**
     * Crea un objeto con los datos del formulario del investigador para enviarlos al servidor
     */
    private createInvestigator(){
        this.investigator.name = this.registerInvestigator.value.name;
        this.investigator.surname = this.registerInvestigator.value.surname;
        this.investigator.mail = this.registerInvestigator.value.mail;
        this.investigator.password = this.registerInvestigator.value.password;
        this.investigator.repeatPassword = this.registerInvestigator.value.repeatPassword;
    }

    private resetVariablesOfValidation(){
        this.passwordsIncorrects = false;
        this.mailAlreadyExist = false;
    }

    register(){ 
        this.createInvestigator();
        this.hide();
        this.resetVariablesOfValidation();
        //Se comienza comprobando que las contraseñas coinciden
        if(this.investigator.password !== this.investigator.repeatPassword){
            this.passwordsIncorrects = true;
        }
        else{
            //Comprobamos que el mail no se encuentre registrado
            this.sendPetitionOfValidateMail();
        }
    }

    private sendPetitionOfValidateMail(){
        var resObs = this.investigatorService.getInvestigatorByMail(this.investigator.mail);
        resObs.subscribe(
            res => {
                if(res == null){
                    //Registramos el investigador, ya que ha pasado las validaciones
                    this.sendPetitionOfRegister()
                }
                else{
                    //Si nos devuelve un investigador significa que el username ya está registrado
                    this.mailAlreadyExist = true;
                }
            },
            err => {
                this.translate.get('investigator.register.mailErr').subscribe((data:any)=> {
                    this.show(data);
                });
                console.log(err)
            }
        )
    }

    /**
     * Hace una llamada al servicio de investigador para llevar a cabo el registro.
     */
    private sendPetitionOfRegister(){
        var resObs = this.investigatorService.register(this.investigator);
        resObs.subscribe(
            res => {
                this.loginService.setCreated(true);
                this.router.navigate(['login/']);
            },
            err => {
                this.translate.get('investigator.register.registerErr').subscribe((data:any)=> {
                    this.show(data);
                });
                console.log(err)
            }
        )
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
