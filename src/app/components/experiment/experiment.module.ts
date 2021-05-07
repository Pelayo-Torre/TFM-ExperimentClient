import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

//Modules
import { ListExperimentComponent } from './experiment-list/listExperiments.component';
import { AddExperimentComponent } from './experiment-add/addExperiment.component';
import { BinnacleComponent } from './binnacle/components/binnacleExperiment.component';
import { DetailExperimentComponent } from './experiment-detail/detailExperiment.component';
import { EditExperimentComponent } from './experiment-edit/editExperiment.component'
import { InvestigatorsAssociatedComponent } from './investigators-associated/investigatorsAssociated.component';
import { ExperimentDataComponent } from './experiment-data/experiment-data.components';
import { ExperimentDataTraceComponent } from './experiment-data/component-trace/experiment-data-trace.component';

//Rutas
import { experimentRoute } from './experiment.route'

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
import {InputNumberModule} from 'primeng/inputnumber';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { BreadcrumbModule } from 'primeng/breadcrumb';


//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';


import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
    imports: [
        RouterModule.forRoot(experimentRoute),

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
        InputNumberModule,
        BreadcrumbModule,
        ProgressSpinnerModule,
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
        ListExperimentComponent,
        AddExperimentComponent,
        BinnacleComponent,
        DetailExperimentComponent,
        EditExperimentComponent,
        InvestigatorsAssociatedComponent,
        ExperimentDataComponent,
        ExperimentDataTraceComponent
    ],
    entryComponents: [
        ListExperimentComponent,
        AddExperimentComponent,
        BinnacleComponent,
        DetailExperimentComponent,
        EditExperimentComponent,
        InvestigatorsAssociatedComponent,
        ExperimentDataComponent,
        ExperimentDataTraceComponent
    ],
    providers: []
})
export class ExperimentModule {}