import { ContainerInvalidArgumentException } from './Abstract/ContainerInvalidArgumentException.js';

export class ContainerInvalidReferenceException extends ContainerInvalidArgumentException {
    constructor(id: string, options?: ErrorOptions) {
        super(`Service with \`${id}\` not found`, options);
        this.name = 'ContainerInvalidReferenceException';
    }
}