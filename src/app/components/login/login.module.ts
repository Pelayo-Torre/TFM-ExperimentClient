import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  

import { LoginComponent } from './login-files/login.component';
import { InitialComponent } from '../initial/initial.component'

import {FormsModule, ReactiveFormsModule} from '@angular/forms'


//Rutas
import { loginRoute } from './login.route'

//PRIMENG
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

 
//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
    imports: [
        RouterModule.forRoot(loginRoute),
        ButtonModule,
        InputTextModule,
        FormsModule,
        MessagesModule,
        MessageModule,
        ReactiveFormsModule,
        CommonModule,
        TranslateModule.forRoot({
            defaultLanguage : 'es',
            loader: {
              provide: TranslateLoader,
              useFactory: (http: HttpClient) => {
                return new TranslateHttpLoader(http);
              },
              deps: [ HttpClient ]
            }
          }),
    ],
    declarations: [
        LoginComponent, InitialComponent
    ],
    entryComponents: [
        LoginComponent, InitialComponent
    ],
    providers: []
})
export class LoginModule {}