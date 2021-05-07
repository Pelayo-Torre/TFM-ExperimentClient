import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'


//Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Authentication
import { httpInterceptorProviders } from './components/login/login-files/interceptor.service';

//Módulos
import { InvestigatorModule } from './components/investigator/investigator.module'
import { ExperimentModule } from './components/experiment/experiment.module'
import { CustomMenuComponent } from './components/shared/menu/custom.menu.component'
import { LoginModule } from './components/login/login.module'
import { PetitionModule } from './components/petition/petition.module'
import { AdministratorModule } from './components/administration/administrator.module'

//Services
import { InvestigatorService } from './components/investigator/investigator.service'
import { ExperimentService } from './components/experiment/experiment.service'
import { LoginService } from './components/login/login.service'
import { BinnacleService } from './components/experiment/binnacle/binnacle.service'
import { PetitionService } from './components/petition/petition.service'
import { AdministrationService } from './components/administration/administrator.service'
import { ExperimentDataService } from './components/experiment/experiment-data.service'

import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    AppComponent,
    CustomMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    InvestigatorModule,
    ExperimentModule,
    PetitionModule,
    AdministratorModule,
    LoginModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
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
  providers: [

    httpInterceptorProviders, 
    InvestigatorService,
    ExperimentService, 
    LoginService, 
    BinnacleService,
    PetitionService,
    AdministrationService,
    ExperimentDataService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }