export interface IResponseData<TData> {
    data: TData;
    status: number;
    message: string;
    description?: string;
    errors?: { [key: string]: any }[];
    stack?: any;
    redirect?: {
        path: string;
    };
    type?: string;
    fieldsModified?: number;
    documentsModified?: number;
    url?: string;
    path?: string;
    success:boolean
}

export interface IResponseDataPaginated<TData> {
    data: TData[];
    page: number;
    limit: number;
    filterCount: number;
    totalCount?: number;
    status: number;
    message: string;
    success: boolean
}
export interface IQueryFilters<TData> {
    page?: number,
    limit?: number,
    filter?: Partial<TData>,
    queryOptions?: Partial<{ limit: number, sort: Partial<{ [key in keyof TData]: 1 | -1 }>, page: number }>
}
export interface IQueryResult<TData = unknown> {
    totalCount: number,
    filterCount: number,
    page: number,
    limit: number,
    data: TData[]
}
export type ID = string | number;