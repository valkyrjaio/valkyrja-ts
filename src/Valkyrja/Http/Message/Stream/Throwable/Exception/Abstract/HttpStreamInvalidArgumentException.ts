/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HttpStreamThrowable } from '../../Contract/HttpStreamThrowable.ts';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.ts';

export abstract class HttpStreamInvalidArgumentException
    extends HttpMessageInvalidArgumentException
    implements HttpStreamThrowable {}
