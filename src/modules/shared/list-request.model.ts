export interface ListRequest {
    query?: string;
    top?:  0 | 1;
    page?: number;
    limit?: number | string;
    sort?: string;
    order?: number;
    filter?: string | number;
    type?: Array<string | number> | string;
    ex?: Array<number | string>
    organisation_id?: Array<number | string>
    affiliate_id?: Array<number | string>
    group_id?: Array<number | string>
    access_group_ids?: Array< string>
}
