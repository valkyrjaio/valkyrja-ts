/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Cast } from '../../../Type/Data/Cast.ts';
import type { ArgumentMode } from '../Enum/ArgumentMode.ts';
import type { ArgumentValueMode } from '../Enum/ArgumentValueMode.ts';
import type { OptionMode } from '../Enum/OptionMode.ts';
import type { OptionValueMode } from '../Enum/OptionValueMode.ts';
import type { CliHandlerReference, CliHelpTextReference, CliMiddlewareReference } from './RouteAttributeMetadata.ts';

/**
 * The options accepted by the CLI `@Route` decorator, mirroring the named
 * constructor arguments of PHP's `Valkyrja\Cli\Routing\Attribute\Route`.
 */
export interface CliRouteOptions<THandler = unknown, THelpText = unknown> {
    name: string;
    description: string;
    /**
     * The handler thunk/method-name pair. See `CliHandlerReference`: the thunk
     * (Fix 1) sidesteps the decorator-time temporal dead zone, and the generic
     * `THandler` (Fix 2) constrains the method name to a real handler on the
     * referenced class.
     */
    handler?: CliHandlerReference<THandler>;
    /**
     * The help-text thunk/method-name pair, e.g. `[() => TestCommand, 'help']`.
     * The thunk is what lets a command reference *itself* here (PHP's
     * `self::class`) without tripping the temporal dead zone.
     */
    helpText?: CliHelpTextReference<THelpText>;
    middleware?: CliMiddlewareReference[];
}

/**
 * The options accepted by the `@ArgumentParameter` decorator, mirroring PHP's
 * `Valkyrja\Cli\Routing\Attribute\ArgumentParameter`.
 */
export interface ArgumentParameterOptions {
    name: string;
    description: string;
    cast?: Cast | null;
    mode?: ArgumentMode;
    valueMode?: ArgumentValueMode;
}

/**
 * The options accepted by the `@OptionParameter` decorator, mirroring PHP's
 * `Valkyrja\Cli\Routing\Attribute\OptionParameter`.
 */
export interface OptionParameterOptions {
    name: string;
    description: string;
    valueDisplayName?: string;
    cast?: Cast | null;
    defaultValue?: string;
    shortNames?: string[];
    validValues?: string[];
    mode?: OptionMode;
    valueMode?: OptionValueMode;
}
