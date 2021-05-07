import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

//Modules
import { PetitionSentComponent } from './petition-components/petitionSent.component'
import { PetitionReceivedComponent } from '../petition/petition-components/petitionReceived.component'

//Rutas
import { petitionRoute } from './petition.route'

//PrimeNg
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {PanelModule} from 'primeng/panel';
import {DialogModule} from 'primeng/dialog';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {ToastModule} from 'primeng/toast';
import {CheckboxModule} from 'primeng/checkbox';



//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';


import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    imports: [
        RouterModule.forRoot(petitionRoute),

        BrowserAnimationsModule,
        HttpClientModule,
        ButtonModule,
        InputTextModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MessagesModule,
        MessageModule,
        ToastModule,
        PanelModule,
        CheckboxModule,
        TableModule,
        DropdownModule,
        DialogModule,
        DynamicDialogModule,
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
    exports: [           ],
    declarations: [

        PetitionSentComponent,
        PetitionReceivedComponent

    ],
    entryComponents: [
       
        PetitionSentComponent,
        PetitionReceivedComponent

    ],
    providers: []
})
export class PetitionModule {}