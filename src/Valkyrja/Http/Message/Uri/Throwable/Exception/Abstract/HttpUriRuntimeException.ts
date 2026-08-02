/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { HttpUriThrowable } from '../../Contract/HttpUriThrowable.ts';
import { HttpMessageRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpMessageRuntimeException.ts';

export abstract class HttpUriRuntimeException extends HttpMessageRuntimeException implements HttpUriThrowable {}
