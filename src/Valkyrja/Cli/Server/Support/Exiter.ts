/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
            process.exit(code);
        } else {
            Exiter.frozenCallback(code);
        }
    }

    static frozenCallback(code: number = 0): void {
        process.stdout.write(String(code));
    }
}
