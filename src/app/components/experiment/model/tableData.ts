export class Header{

    name: string;
    id: string;
    strategy: number;

    constructor(name: string, id: string, strategy:number){
        this.name = name;
        this.id = id;
        this.strategy = strategy;
    }

}

export class Result {

    value: any;
    id: string;

    constructor(id: string, value: any){
        this.id = id;
        this.value = value;
    }

}