export class EventData {
    constructor(
        public readonly events: Record<string, string[]> = {},
        public readonly listeners: Record<string, () => object> = {},
    ) {}
}
