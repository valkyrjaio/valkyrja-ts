/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HttpStructThrowable } from '../../Contract/HttpStructThrowable.ts';
import { HttpInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpInvalidArgumentException.ts';

export abstract class HttpStructInvalidArgumentException
    extends HttpInvalidArgumentException
    implements HttpStructThrowable {}
