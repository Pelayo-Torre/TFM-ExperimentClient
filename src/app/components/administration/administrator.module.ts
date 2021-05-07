import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

//Modules
import { ListRequestsComponent } from './requests/listRequests.component';
import { AddAdministratorComponent } from './administrator-add/addAdministrator.component'

//Rutas
import { administrationRoute } from './administrator.route'

//PrimeNg
import {InputTextareaModule} from 'primeng/inputtextarea';
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
import {ToolbarModule} from 'primeng/toolbar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CalendarModule} from 'primeng/calendar';
import {CheckboxModule} from 'primeng/checkbox';


//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';


import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    imports: [
        RouterModule.forRoot(administrationRoute),

        BrowserAnimationsModule,
        HttpClientModule,
        InputTextareaModule,
        ButtonModule,
        InputTextModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MessagesModule,
        CalendarModule,
        MessageModule,
        ToastModule,
        RadioButtonModule,
        ToolbarModule,
        CheckboxModule,
        PanelModule,
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
        ListRequestsComponent,
        AddAdministratorComponent
    ],
    entryComponents: [
        ListRequestsComponent,
        AddAdministratorComponent
    ],
    providers: []
})
export class AdministratorModule {}