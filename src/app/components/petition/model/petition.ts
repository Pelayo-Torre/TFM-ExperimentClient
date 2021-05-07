export class Petition {

    id: number;
    idInvestigator: number;
    statusPetition: string;
    shippingDate: Date;
	answerDate: Date;
    manager: boolean;
    creator: boolean;
    formatDate: string;

    //Datos del experimento asociado a la petición
    idExperiment: number;
	title: string;
	description: string;
    statusExperiment: string;
    
    //Datos del investigador que recibe la petición
    name: string;
	surname: string;
	mail: string;

}