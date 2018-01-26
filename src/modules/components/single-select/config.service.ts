import { Injectable } from '@angular/core';
import { OptionModel } from './model';

@Injectable()
export class SingleSelectConfig {
    /**
     * @type {string}
     * request params key in which be send value, that user entered in search string
     */
    requestParamSearchKey: string = 'query';

    /**
     * request params key that used for pagination, limit response items
     * @type {string}
     */
    requestParamLimitKey: string = 'limit';

    /**
     * additional request params
     * @type {{}}
     */
    requestParams: any = {};

    /**
     * additional request headers
     * @type {{}}
     */
    requestHeaders: any = {};

    /**
     * if set true, to the ajax request will be added '${requestParamLimitKey}' & 'page' params
     * @type {boolean}
     */
    enablePagination: boolean = false;

    /**
     * @param array element
     * @returns {OptionModel}
     */
    responseMapFn(el: any): OptionModel {
        return {
            label: el.title || el.text || el.label || el.url,
            value: el.id || el.value
        };
    };

    /**
     * if response will be not plain array, but object with array in some key, need define key there
     * @type {string}
     */
    responseArrayKey: string = 'data';

    /**
     * server name for ajax request
     * @type {string}
     */
    server: string = '';

    /**
     * if set true - by default search will be disabled
     * @type {boolean}
     */
    disableSearch: boolean = false;

    /**
     * default placeholder
     * @type {boolean}
     */
    placeholder: string = 'Select option';

    /**
     * if set true - will be shown button, that reset selected value
     * @type {boolean}
     */
    allowClear: boolean = false;

    /**
     * default name for new entity
     * @type {string}
     */
    entityName: string = 'item';

    /**
     * if set true - will be shown additional button '+ Add new' at the bottom of list
     * @type {boolean}
     */
    showAddNewBtn: boolean = false;
}