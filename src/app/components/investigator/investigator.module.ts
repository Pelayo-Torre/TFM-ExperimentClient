import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  

import { AddInvestigatorComponent } from './investigator-add/addInvestigator.component';

import {CustomPrimaryButtonComponent} from '../shared/buttons/custom.primary.button';
import {CustomInputTextComponent} from '../shared/inputs/custom.input.text'

import {FormsModule, ReactiveFormsModule} from '@angular/forms'


//Rutas
import { investigatorRoute } from './investigator.route'

//PRIMENG
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

 
//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
    imports: [
        RouterModule.forRoot(investigatorRoute),
        ButtonModule,
        InputTextModule,
        PasswordModule,
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
        AddInvestigatorComponent,
        CustomPrimaryButtonComponent,
        CustomInputTextComponent
    ],
    entryComponents: [
        AddInvestigatorComponent
    ],
    providers: []
})
export class InvestigatorModule {}