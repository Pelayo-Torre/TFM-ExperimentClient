export class DemographicData{

    name: string;
    type: string;

    constructor (name: string, type: string){
        this.name = name;
        this.type = type;
    }

   
}

export class TypeDemographicData{

    name: string;

}

export class DemographicDataDTO {

    name: string;
	type: string;
	id: number;
	idExperiment: number;
    values: DemographicDataValueDTO [];
}

export class DemographicDataValueDTO {

	user: string;
	id: number;
	numberValue: number;
	stringValue: string;
	dateValue: Date;
	
}