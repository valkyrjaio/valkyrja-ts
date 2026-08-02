/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ContainerData } from '../../../../../src/Valkyrja/Container/Data/ContainerData.ts';

describe('ContainerData', () => {
    it('has empty defaults', () => {
        const data = new ContainerData();

        expect(data.aliases).toStrictEqual({});
        expect(data.deferredCallback).toStrictEqual({});
        expect(data.services).toStrictEqual({});
        expect(data.singletons).toStrictEqual({});
    });
});
