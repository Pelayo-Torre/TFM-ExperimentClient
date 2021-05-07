import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'custom-input-text',
    templateUrl: './custom.input.text.html',
})
export class CustomInputTextComponent implements OnInit {

    @Input() maxlength: Number = 25;
    @Input() controlName: String;

    constructor() {}

    ngOnInit() {}

} 