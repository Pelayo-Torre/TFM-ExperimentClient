import { Routes } from '@angular/router';

import { LoginComponent } from './login-files/login.component';
import { InitialComponent } from '../initial/initial.component'


export const loginRoute: Routes = [

    {
        path: '',
        component: InitialComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }

]