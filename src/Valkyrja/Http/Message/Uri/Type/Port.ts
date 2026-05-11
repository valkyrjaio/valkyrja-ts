import { HttpUriInvalidPortException } from '../Throwable/Exception/HttpUriInvalidPortException.js';

export class Port {
    protected subject: number;

    constructor(subject: number) {
        if (subject >= 1 && subject <= 65535) {
            this.subject = subject;
            return;
        }

        throw new HttpUriInvalidPortException('Invalid port argument passed.');
    }

    static fromValue(value: unknown): Port {
        if (typeof value !== 'number') {
            throw new HttpUriInvalidPortException(`Int expected value of type \`${typeof value}\` provided`);
        }

        return new Port(value);
    }

    asFlatValue(): number {
        return this.subject;
    }

    asValue(): number {
        return this.subject;
    }
}
