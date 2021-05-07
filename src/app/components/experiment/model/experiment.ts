import { DemographicData } from '../../experiment/model/demographicData'

export class Experiment {

    id: number;
    title: string;
    description: string;
    creationDate: Date;
    status: string;
    idInvestigator: number;
    formatDate?: string;

    //Datos del investigador creador
    nameInvestigator: String;
    surnameInvestigator: String;
    mailInvestigator: String;

    //Datos demográficos
    demographicData: DemographicData []

}