export interface modalI{
    title?:string;
    content?:any;
    btns?:{positive?:string|boolean, negative?:string|boolean}|false;
    type?:'success'|'error'|'info'|'warning' 
}