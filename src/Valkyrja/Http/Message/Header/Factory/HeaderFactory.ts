import { HttpHeaderInvalidNameException } from '../Throwable/Exception/HttpHeaderInvalidNameException.js';
import { HttpHeaderInvalidValueException } from '../Throwable/Exception/HttpHeaderInvalidValueException.js';

export abstract class HeaderFactory {
    static marshalHeaders(server: Record<string, string | number>): Record<string, string> {
        const headers: Record<string, string> = {};
        for (const [key, value] of Object.entries(server)) {
            const lower = key.toLowerCase();
            if (lower.startsWith('http_')) {
                const name = lower.slice(5).replaceAll('_', '-');
                headers[name] = String(value);
            } else if (lower === 'content_type' || lower === 'content_length' || lower === 'content_md5') {
                const name = lower.replaceAll('_', '-');
                headers[name] = String(value);
            }
        }
        return headers;
    }

    static filterValue(value: string): string {
        let result = '';
        for (let i = 0; i < value.length; i++) {
            const ascii = value.charCodeAt(i);
            if (ascii === 13) {
                const lf = value.charCodeAt(i + 1);
                const ws = value.charCodeAt(i + 2);
                if (lf === 10 && (ws === 9 || ws === 32)) {
                    result += (value[i] ?? '') + (value[i + 1] ?? '');
                    i++;
                }
                continue;
            }
            if (!HeaderFactory.isInvalidValueAscii(ascii)) {
                result += value[i] ?? '';
            }
        }
        return result;
    }

    static assertValidValue(value: string): void {
        if (!HeaderFactory.isValidValue(value)) {
            throw new HttpHeaderInvalidValueException(`"${value}" is not valid header value`);
        }
    }

    static isValidValue(value: string): boolean {
        if (/(?:(?:(?<!\r)\n)|(?:\r(?!\n))|(?:\r\n(?![ \t])))/.test(value)) {
            return false;
        }
        // eslint-disable-next-line no-control-regex
        if (/[^\x09\x0a\x0d\x20-\x7E\x80-\xFE]/.test(value)) {
            return false;
        }
        return true;
    }

    static assertValidName(name: string): void {
        if (!HeaderFactory.isValidName(name)) {
            throw new HttpHeaderInvalidNameException(`"${name}" is not valid header name`);
        }
    }

    static isValidName(name: string): boolean {
        return name !== '' && /^[!#$%&'*+\-.0-9A-Z^_`a-z|~]+$/.test(name);
    }

    protected static isInvalidValueAscii(ascii: number): boolean {
        return (ascii < 32 && ascii !== 9 && ascii !== 10 && ascii !== 13) || ascii === 127 || ascii === 255;
    }
}
