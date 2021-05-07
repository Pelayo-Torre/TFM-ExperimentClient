import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenService } from './token.service';
import { LoginData } from './login.credentials';
import { SessionStorageService } from 'angular-web-storage';
import { InvestigatorService } from '../../investigator/investigator.service';
import { Router } from '@angular/router';
import { Investigator } from '../../investigator/model/investigator'
import { Message } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'LoginComponente',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../shared/common-style.css' ]
})
export class LoginComponent {

  //VARIABLES para mostrar error de autenticación al usuario
  isLoginFailed;

   //Alertas
   msgs: Message[];

  private roles: string[] = [];

  private loginData: LoginData;
  loginInvestigator: FormGroup;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private session : SessionStorageService,
    private router: Router,
    private investigatorService : InvestigatorService,
    private translate: TranslateService
  ) {
    this.isLoginFailed = false;
    this.loginInvestigator = this.fb.group({
        login: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.tokenService.getToken()) {
      this.roles = this.tokenService.getAuthorities();
    }
    //Alerta de registro correcto
    if (this.loginService.isCreated()) {
      this.loginService.setCreated(false);
      this.translate.get('investigator.register.registerSuccess').subscribe((data:any)=> {
          this.show(data, 'success');
      });
      setTimeout(() => this.hide(), 5000);
    }
  }

  /**
   * Crea un objeto con los datos del formulario
   */
  private createUser(){
    var username = this.loginInvestigator.value.login;
    var password = this.loginInvestigator.value.password;
    return new LoginData(username, password);
  }

  /**
   * Identifica al usuario que introdijo los datos en el formulario
   */
  identifyUser(): void {

    this.loginData = this.createUser();

    this.loginService.identifyUser(this.loginData).subscribe(
      data => {
          //Se guarda el token del usuario en sesión
          this.tokenService.save(data.accessToken);
          //Se guarda el nombre de usuario en sesión
          this.tokenService.saveUser(data.mail);
          //Se guarda la rol del usuario en sesión
          this.tokenService.saveAuths(data.authorities);
          //mostrar al usuario que no hay error de logeo
          this.isLoginFailed = false;
          //Se devuelve el rol del usuario
          this.roles = this.tokenService.getAuthorities();
          this.authentication(); 
      },
      error => {
        if(error.status === 401){
          this.isLoginFailed = true;
        }
        else{
          this.translate.get('login.loginErr').subscribe((data:any)=> {
            this.show(data, 'error');
          });
        }
      }
    );

  }

  /**
   * Dependiendo del usuario que se ha autenticado, redirigirá a una url u otra
   */
  authentication() {
      if (this.tokenService.getToken()) {
          this.userInSession();
      }
  }

  /**
   * Usuario en sesión 
   */
  userInSession() {
      var resObs = this.investigatorService.getUserInSession();
      resObs.subscribe(
          res => {
              //Almacenamos en sesión los datos del usuario
              this.session.set("investigator", this.createInvestigator(res));
              this.setAuthority();
              this.session.set("logged", true);
          },
        err => {
          this.translate.get('login.loginErr').subscribe((data:any)=> {
            this.show(data, 'error');
          });
        }
      );
  }

  private setAuthority(){
      this.roles = this.tokenService.getAuthorities();
      this.roles.every(role => {
          if (role === 'INVESTIGATOR_EVALUATION') {
              this.router.navigate(['/experiments']);
              return false;
          } else if (role === 'INVESTIGATOR_VALIDATED') {
              this.router.navigate(['/experiments']);
              return false;
          }
          this.router.navigate(['/experiments']);
          return true;
      });
  }

  /**
   * Crea un objeto con los datos del investigador que se encuentra en sesión
   */
  private createInvestigator(data: any){
      let investigator = new Investigator();

      investigator.id = data.id;
      investigator.mail = data.mail;
      investigator.name = data.name;
      investigator.role = data.role;
      investigator.surname = data.surname;
      investigator.requestPending = data.requestPending;
      investigator.registrationDate = data.registrationDate;
      var date = new Date(data.registrationDate);
      date.setDate(date.getDate() + 15)
      investigator.expirationDate = date;
      return investigator;
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
