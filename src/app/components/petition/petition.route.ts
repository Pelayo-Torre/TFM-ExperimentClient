import { Routes } from '@angular/router';
import { LoginGuardGuard } from '../../guards/login-guard'
import { PetitionSentComponent } from '../petition/petition-components/petitionSent.component'
import { PetitionReceivedComponent } from '../petition/petition-components/petitionReceived.component'

export const petitionRoute: Routes = [   

    {
        path: 'petitions/sent',
        canActivate: [LoginGuardGuard],
        component: PetitionSentComponent
    },
    {
        path: 'petitions/received',
        canActivate: [LoginGuardGuard],
        component: PetitionReceivedComponent
    }

]