export class Exiter {
    protected static shouldExit: boolean = true;

    static freeze(): void {
        Exiter.shouldExit = false;
    }

    static unfreeze(): void {
        Exiter.shouldExit = true;
    }

    static exit(code: number = 0): void {
        Exiter.shouldExit ? process.exit(code) : Exiter.frozenCallback(code);
    }

    static frozenCallback(code: number = 0): void {
        process.stdout.write(String(code));
    }
}
