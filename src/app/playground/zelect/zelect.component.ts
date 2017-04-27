import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'zelect-playground',
    templateUrl: './zelect.template.html'
})
export class ZelectPlaygroundComponent {
    public options = [
        {value: 1, label: 'test'}
    ];

    public form = new FormGroup({
        select: new FormControl('')
    });

    public onCreate(event) {
        console.log(event);
    }
}
