import { Routes } from '@angular/router';

import { LoginComponent } from './login-files/login.component';


export const loginRoute: Routes = [

    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }

]