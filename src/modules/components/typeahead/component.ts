import { Component, OnInit, Input, Directive, forwardRef, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { _do } from "rxjs/operator/do";
import { letProto } from "rxjs/operator/let";
import { Subscription } from "rxjs/Subscription";


enum Key {
  Tab = 9,
  Enter = 13,
  Escape = 27,
  ArrowUp = 38,
  ArrowDown = 40
}

// const ADM_TYPEAHEAD_VALUE_ACCESSOR = {
//   provide: NG_VALUE_ACCESSOR,
//   useExisting: forwardRef(() => TypeaheadComponent),
//   multi: true
// };

@Directive({
    selector: 'input[admTypeahead], textarea[admTypeahead]',
    // providers: [ADM_TYPEAHEAD_VALUE_ACCESSOR]
})

export class TypeaheadComponent implements OnInit {
    _valueChanges:Observable<string>;
    _userInput: string;
    _subscription:Subscription;

    @Input() admTypeahead:(text:Observable<string>)=>Observable<any[]>;
    // @Input() placeholder:string;

    constructor(private _el:ElementRef) { 
        console.log('---adm-typeahead--');
        this._valueChanges = Observable.fromEvent(this._el.nativeElement, 'input', ($event:Event)=>(<HTMLInputElement>$event.target).value);
        
    }

    ngOnInit() {
        this._valueChanges.subscribe((str)=>{
            console.log('sda', str)
        })
        const inputValues$ = _do.call(this._valueChanges, value => {
            console.log('vakue changes', value);
            this._userInput = value;
        });
        const results$ = letProto.call(inputValues$, this.admTypeahead);
        // const userInput$ = _do.call(results$);
        this._subscription = this._subscribeToUserInput(results$);
    }

    _subscribeToUserInput(userInput:Observable<any[]>):Subscription{
        return userInput.subscribe((results)=>{
            console.log('_subscribeToUserInput', results);
        })
    }
}