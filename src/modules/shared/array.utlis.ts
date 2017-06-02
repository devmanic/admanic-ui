import { Injectable } from '@angular/core';

@Injectable()
export class ArrayUtils {
    static flatMap<T, U>(array: T[], mapFunc: (x: T) => U[]): U[] {
        return array.reduce((cumulus: U[], next: T) => [...mapFunc(next), ...cumulus], <U[]> []);
    }
}