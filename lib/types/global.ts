interface BaseResponseData {
    status: number;
    message: string;
    description?: string;
    url?: string;
    path?: string;
    type?: string;
}

interface ResErr extends BaseResponseData {
    success: false
    error?: { message: string };
    stack?: any;
}
interface ResSuccess<TData> extends BaseResponseData {
    success: true,
    data: TData,
    redirect?: {
        path: string;
    };
    fieldsModified?: number;
    documentsModified?: number;
}


interface Pagination<TData> extends ResSuccess<TData[]> {
    page: number;
    limit: number;
    totalPages: number;
    filterCount: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    firstItemIndex: number;
    lastItemIndex: number;
    sortField?: string;
    sortOrder?: "asc" | "desc";
    nextPage?: number;
    previousPage?: number;
}
export type IResponseData<TData> = ResSuccess<TData> | ResErr
export type IResponseDataPaginated<TData> = Pagination<TData> | ResErr
export type ID = string | number;

export interface IQueryFilters<TData> {
    page?: number,
    limit?: number,
    filter?: Partial<TData>,
    queryOptions?: Partial<{ limit: number, sort: Partial<{ [key in keyof TData]: 1 | -1 }>, page: number }>
}
