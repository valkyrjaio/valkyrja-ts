export abstract class CookieFactory {
    static parseCookieHeader(cookieHeader: string): Record<string, string> {
        const cookies: Record<string, string> = {};
        const pattern = /(?:^[\n]?[ \t]*|;[ ])(?<name>[!#$%&'*+\-.0-9A-Z^_`a-z|~]+)=(?<DQUOTE>"?)(?<value>[\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]*)(?<DQCLOSE>"?)(?=[\n]?[ \t]*$|;[ ])/g;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(cookieHeader)) !== null) {
            const name  = match.groups?.['name'] ?? '';
            const value = match.groups?.['value'] ?? '';
            if (name !== '') {
                cookies[name] = decodeURIComponent(value);
            }
        }
        return cookies;
    }

    static convertCookieArrayToHeaderString(cookies: Record<string, string>): string {
        return Object.entries(cookies)
            .map(([key, value]) => CookieFactory.combineKeyAndValue(key, value))
            .join('; ');
    }

    static combineKeyAndValue(key: string, value: string): string {
        return `${key}=${value}`;
    }
}
