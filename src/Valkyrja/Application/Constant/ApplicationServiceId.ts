/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class ApplicationServiceId {
    static readonly ApplicationContract = 'Valkyrja.Application.Kernel.ApplicationContract' as const;
    static readonly ConfigContract = 'Valkyrja.Application.Data.ConfigContract' as const;
    static readonly CliConfigContract = 'Valkyrja.Application.Data.CliConfigContract' as const;
    static readonly HttpConfigContract = 'Valkyrja.Application.Data.HttpConfigContract' as const;
    static readonly GrpcConfigContract = 'Valkyrja.Application.Data.GrpcConfigContract' as const;
    static readonly Config = 'Valkyrja.Application.Data.Config' as const;
}
