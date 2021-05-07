import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'custom-primary-button',
    templateUrl: './custom.primary.button.html',
})
export class CustomPrimaryButtonComponent implements OnInit {

    @Input() label: String;
    @Input() status: boolean;

    constructor() {}

    ngOnInit() {}

} 