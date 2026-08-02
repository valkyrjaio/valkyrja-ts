/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class OptionShortName {
    static readonly HELP = 'h' as const;
    static readonly VERSION = 'v' as const;
    static readonly QUIET = 'q' as const;
    static readonly SILENT = 's' as const;
    static readonly NO_INTERACTION = 'N' as const;
    static readonly TOKEN = 't' as const;
}
