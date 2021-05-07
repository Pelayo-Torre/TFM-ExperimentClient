import { Routes } from '@angular/router';
import { LoginGuardGuard } from '../../guards/login-guard'
import { ListExperimentComponent } from './experiment-list/listExperiments.component';
import { AddExperimentComponent } from './experiment-add/addExperiment.component';
import { DetailExperimentComponent } from './experiment-detail/detailExperiment.component';
import { ExperimentDataComponent } from './experiment-data/experiment-data.components'

export const experimentRoute: Routes = [   

    {
        path: 'experiments',
        canActivate: [LoginGuardGuard],
        component: ListExperimentComponent
    },
    {
        path: 'experiments/register',
        canActivate: [LoginGuardGuard],
        component: AddExperimentComponent
    },
    {
        path: 'experiments/detail/:id',
        canActivate: [LoginGuardGuard],
        component: DetailExperimentComponent
    },
    {
        path: 'experiments/data/:id',
        canActivate: [LoginGuardGuard],
        component: ExperimentDataComponent
    }

]