import { Routes } from '@angular/router';

import { AddInvestigatorComponent } from './investigator-add/addInvestigator.component';


export const investigatorRoute: Routes = [

    {
        path: 'investigator/register',
        component: AddInvestigatorComponent
    }

]