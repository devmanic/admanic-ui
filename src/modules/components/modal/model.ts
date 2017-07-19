export interface modalI{
    title?:string;
    content?:any;
    btns?:{postive?:string|boolean, negative?:string|boolean}|false;
    type?:'success'|'error'|'info'|'warning' 
}