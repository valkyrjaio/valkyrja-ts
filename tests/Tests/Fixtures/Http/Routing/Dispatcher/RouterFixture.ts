/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { Router } from '../../../../../../src/Valkyrja/Http/Routing/Dispatcher/Router.ts';

import type { MatcherContract } from '../../../../../../src/Valkyrja/Http/Routing/Matcher/Contract/MatcherContract.ts';

/**
 * Exposes Router's protected matcher so a test can read the default the constructor builds.
 */
export class RouterFixture extends Router {
    public getMatcher(): MatcherContract {
        return this.matcher;
    }
}
