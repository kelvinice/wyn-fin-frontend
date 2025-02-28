export type YupError = {
    name: string
    message: string
}

export type EndpointCallResponse = {
    message?: string
    data: string
}

export type EndpointCallResponseMessage = {
    message: string
}

export type AxiosResponse = {
    response: string
}

export type DataResponse<T> = {
    data: T
}