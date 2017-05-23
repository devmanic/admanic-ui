import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'zelect-playground',
    templateUrl: './zelect.template.html'
})
export class ZelectPlaygroundComponent {
    public options: any[] = [];
    public select_with_add_new: any[] = [];
    public options_with_groups: any[] = [];
    public select_with_new_entity: any[] = [];
    public select_with_dynamic_data: any[] = [];

    public form = new FormGroup({
        select: new FormControl(''),
        select_with_add_new: new FormControl(''),
        options_with_groups: new FormControl(''),
        select_with_new_entity: new FormControl(''),
        select_with_allowClear: new FormControl(''),
        select_with_icon: new FormControl(''),
        select_with_dynamic_data: new FormControl(''),
        select_with_validators: new FormControl('', [Validators.required])
    });

    constructor() {
        let generateItems = (len: number): any[] => {
            let arr = [];
            for (let i = 1; i < len; i++) {
                arr.push(this.generateSelectItem(i + 3));
            }
            return arr;
        };

        for (let i = 1; i < 5; i++) {
            this.select_with_new_entity.push(this.generateSelectItem(i));
            this.select_with_dynamic_data.push(this.generateSelectItem(i));
        }

        for (let i = 1; i < 16; i++) {
            this.options.push(this.generateSelectItem(i));
            this.select_with_add_new.push(this.generateSelectItem(i + 3));
            this.options_with_groups.push({
                name: `group #${i}`,
                values: generateItems(5)
            });
        }
    }

    public addNewTo(key: string) {
        this[key] = this[key].concat([this.generateSelectItem(Math.floor(Math.random() * 10))]);
    }

    public clearArr(key: string) {
        this[key] = [];
    }

    public selectFirst(key: string) {
        if (!this[key].length || !!!this.form.get(key)) {
            return;
        }
        this.form.get(key).setValue(this[key][0].value);
    }

    public onCreate(event) {
        console.log(event);
    }

    public newEntityAdd(e) {
        console.info(`add new entity, title: ${e}`);
    }

    public clearItem(key: string) {
        this.form.get(key).setValue(null);
    }

    private generateSelectItem(i: number) {
        let val = Math.floor(Math.random() * (i * 1000)).toString();
        return {
            value: val,
            label: `item  ${val}`
        };
    }
}
