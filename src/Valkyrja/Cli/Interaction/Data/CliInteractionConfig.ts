import type { CliInteractionConfigContract } from './Contract/CliInteractionConfigContract.js';

export class CliInteractionConfig implements CliInteractionConfigContract {
    constructor(
        public isQuiet: boolean = false,
        public isInteractive: boolean = true,
        public isSilent: boolean = false,
    ) {}
}