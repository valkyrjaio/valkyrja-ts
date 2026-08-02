/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationInfo } from '../../../../../src/Valkyrja/Application/Constant/ApplicationInfo.ts';
import { Config } from '../../../../../src/Valkyrja/Application/Data/Config.ts';
import { ApplicationComponentProvider } from '../../../../../src/Valkyrja/Application/Provider/ApplicationComponentProvider.ts';

describe('Config', () => {
    it('has the expected defaults', () => {
        const data = new Config();

        expect(data.environment).toBe('production');
        expect(data.version).toBe(ApplicationInfo.VERSION);
        expect(data.debugMode).toBe(false);
        expect(data.providers.length).toBeGreaterThan(0);
        expect(data.providers[0]).toBeInstanceOf(ApplicationComponentProvider);
        expect(data.timezone).toBe('UTC');
    });
});
