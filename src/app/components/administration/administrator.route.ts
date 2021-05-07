import { Routes } from '@angular/router';
import { LoginGuardGuard } from '../../guards/login-guard'
import { ListRequestsComponent } from './requests/listRequests.component';
import { AddAdministratorComponent } from './administrator-add/addAdministrator.component'

export const administrationRoute: Routes = [   

    {
        path: 'administration/requests',
        canActivate: [LoginGuardGuard],
        component: ListRequestsComponent
    },
    {
        path: 'administration/register/administrator',
        canActivate: [LoginGuardGuard],
        component: AddAdministratorComponent
    }

]