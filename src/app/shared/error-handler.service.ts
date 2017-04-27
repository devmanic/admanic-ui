import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ToastrService } from './toastr.service';

@Injectable()
export class ErrorHandler {
    constructor(private router: Router,
                private location: Location) {

    }

    public handle(err: Response | any, caught: any): Observable<any> {
        this.getServerErrorMessage(err);
        if (err.status === 401) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('user-info');
            this.router.navigate(['/login']);
        }
        if (err.status === 404) {
            this.router.navigate(['/404']);
        }
        return Observable.throw(err);
    }

    private getServerErrorMessage(errorResponse: Response): void {
        let errors = errorResponse.json().errors;
        if (errors) {
            let msg = errors[Object.keys(errors)[0]];
            ToastrService.error('', msg);
        } else {
            ToastrService.error('', 'Error occurred');
        }

    }
}
