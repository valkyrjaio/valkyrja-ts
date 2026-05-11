export class ContentTypeValue {
    static readonly APPLICATION_JSON       = 'application/json' as const;
    static readonly APPLICATION_JAVASCRIPT = 'application/javascript' as const;
    static readonly APPLICATION_XML        = 'application/xml' as const;
    static readonly APPLICATION_XML_UTF8   = `${ContentTypeValue.APPLICATION_XML}; charset=utf-8` as const;
    static readonly APPLICATION_X_WWW_FORM = 'application/x-www-form-urlencoded' as const;
    static readonly MULTIPART_FORM_DATA    = 'multipart/form-data' as const;
    static readonly TEXT_HTML              = 'text/html' as const;
    static readonly TEXT_HTML_UTF8         = `${ContentTypeValue.TEXT_HTML}; charset=utf-8` as const;
    static readonly TEXT_JAVASCRIPT        = 'text/javascript' as const;
    static readonly TEXT_PLAIN             = 'text/plain' as const;
    static readonly TEXT_PLAIN_UTF8        = `${ContentTypeValue.TEXT_PLAIN}; charset=utf-8` as const;
}
