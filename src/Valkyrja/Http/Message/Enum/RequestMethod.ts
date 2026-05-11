export enum RequestMethod {
    GET     = 'GET',
    HEAD    = 'HEAD',
    POST    = 'POST',
    PUT     = 'PUT',
    DELETE  = 'DELETE',
    CONNECT = 'CONNECT',
    OPTIONS = 'OPTIONS',
    TRACE   = 'TRACE',
    PATCH   = 'PATCH',
    ANY     = 'ANY',
}

export function allRequestMethods(): RequestMethod[] {
    return [
        RequestMethod.GET,
        RequestMethod.HEAD,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE,
        RequestMethod.CONNECT,
        RequestMethod.OPTIONS,
        RequestMethod.TRACE,
        RequestMethod.PATCH,
    ];
}
