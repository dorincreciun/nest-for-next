interface ServerResponseSuccess<T> {
    success: true
    messages: string[]
    data: T
    meta?: Record<string, string[]>
}

interface ServerResponseFailed<T> {
    success: false
    messages: string[]
    errors: string[]
    statusCode: number
}

export type ServerResponse<T> =
    | ServerResponseSuccess<T>
    | ServerResponseFailed<T>