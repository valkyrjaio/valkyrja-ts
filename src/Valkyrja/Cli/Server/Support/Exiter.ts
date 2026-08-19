/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class Exiter {
    protected static shouldExit: boolean = true;

    static freeze(): void {
        Exiter.shouldExit = false;
    }

    static unfreeze(): void {
        Exiter.shouldExit = true;
    }

    static exit(code: number = 0): void {
        if (Exiter.shouldExit) {
            // process.exit ends the process before the event loop drains, dropping a buffered write.
            process.exitCode = code;
        } else {
            Exiter.frozenCallback(code);
        }
    }

    static frozenCallback(code: number = 0): void {
        process.stdout.write(String(code));
    }
}
