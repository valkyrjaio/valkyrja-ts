/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliInteractionConfig } from '../../../../../../../src/Valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { Input } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Input.ts';
import { Option } from '../../../../../../../src/Valkyrja/Cli/Interaction/Option/Option.ts';
import { CheckGlobalInteractionOptionsMiddleware } from '../../../../../../../src/Valkyrja/Cli/Server/Middleware/InputReceived/CheckGlobalInteractionOptionsMiddleware.ts';

import type { InputContract } from '../../../../../../../src/Valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { InputReceivedHandlerContract } from '../../../../../../../src/Valkyrja/Cli/Middleware/Handler/Contract/InputReceivedHandlerContract.ts';

const handler = { inputReceived: (input: InputContract): InputContract => input } as InputReceivedHandlerContract;

function make(config: CliInteractionConfig): CheckGlobalInteractionOptionsMiddleware {
    return new CheckGlobalInteractionOptionsMiddleware(config, 'no-interaction', 'N', 'quiet', 'q', 'silent', 's');
}

describe('CheckGlobalInteractionOptionsMiddleware', () => {
    it('toggles config flags from the matching options', () => {
        const config = new CliInteractionConfig();
        make(config).inputReceived(
            new Input('cli', 'build').withOptions(new Option('N'), new Option('quiet'), new Option('s')),
            handler,
        );

        expect(config.isInteractive).toBe(false);
        expect(config.isQuiet).toBe(true);
        expect(config.isSilent).toBe(true);
    });

    it('leaves the config untouched without options', () => {
        const config = new CliInteractionConfig();
        make(config).inputReceived(new Input('cli', 'build'), handler);

        expect(config.isInteractive).toBe(true);
        expect(config.isQuiet).toBe(false);
        expect(config.isSilent).toBe(false);
    });
});
