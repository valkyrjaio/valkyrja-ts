export class Port {
    static readonly MIN   = 1 as const;
    static readonly MAX   = 65535 as const;
    static readonly HTTP  = 80 as const;
    static readonly HTTPS = 443 as const;

    static isValid(port: number): boolean {
        return port >= Port.MIN && port <= Port.MAX;
    }
}
