/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Header } from '../../../../../../src/Valkyrja/Cli/Interaction/Message/Header.ts';

import type { RouteContract } from '../../../../../../src/Valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';

const route = {
    getDescription: (): string => 'route description',
    getName: (): string => 'route:name',
} as unknown as RouteContract;

describe('Header', () => {
    it('falls back to the route description and name when not provided', () => {
        const header = new Header('App', '1.0.0', route);

        const text = header.getText();

        expect(text).toContain('╭── App v1.0.0');
        expect(text).toContain('route description · route:name');
    });

    it('uses explicit action description, command name, and project root when provided', () => {
        const header = new Header(
            'App',
            '1.0.0',
            route,
            'ICON',
            '2.0.0',
            'today',
            'v20',
            '/project',
            'custom description',
            'custom:command',
        );

        const text = header.getText();

        expect(text).toContain('│   /project');
        expect(text).toContain('custom description · custom:command');
        expect(text).toContain('Built on Valkyrja v2.0.0 (date: today)');
        expect(text).toContain('Running on Node v20');
    });

    it('returns immutable clones from each wither', () => {
        const header = new Header('App', '1.0.0', route);

        expect(header.withAppName('Other').getText()).toContain('╭── Other');
        expect(header.withAppVersion('9.9.9').getText()).toContain('v9.9.9');
        expect(header.withIcon('NEWICON').getText()).toContain('│   NEWICON');
        expect(header.withValkyrjaVersion('3.3.3').getText()).toContain('Built on Valkyrja v3.3.3');
        expect(header.withValkyrjaBuildDate('tomorrow').getText()).toContain('date: tomorrow');
        expect(header.withNodeVersion('v22').getText()).toContain('Running on Node v22');
        expect(header.withProjectRoot('/root').getText()).toContain('│   /root');
        expect(header.withActionDescription('did a thing').getText()).toContain('did a thing ·');
        expect(header.withCommandName('the:command').getText()).toContain('· the:command');
    });
});
