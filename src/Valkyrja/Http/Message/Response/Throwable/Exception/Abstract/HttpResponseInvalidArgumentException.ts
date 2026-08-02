/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HttpResponseThrowable } from '../../Contract/HttpResponseThrowable.ts';
import { HttpMessageInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/HttpMessageInvalidArgumentException.ts';

export abstract class HttpResponseInvalidArgumentException
    extends HttpMessageInvalidArgumentException
    implements HttpResponseThrowable {}
