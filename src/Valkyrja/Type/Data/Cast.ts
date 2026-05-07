export class Cast {
    constructor(
        public readonly type: string,
        public readonly convert: boolean = true,
        public readonly isArray: boolean = false,
    ) {}
}