export class InvestigatorAdd {

    id: number;
    name: string;
    surname: string;
    mail: string;
    password: string;
    repeatPassword: string;

}

export class Investigator {

    id: number;
    name: string;
    surname: string;
    mail: string;
    role: string;
    manager: Boolean;
    requestPending: Boolean;
    registrationDate: Date;
    expirationDate: Date;
}