/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { HttpRuntimeException } from '../../../../Throwable/Exception/Abstract/HttpRuntimeException.ts';

import type { HttpClientThrowable } from '../../Contract/HttpClientThrowable.ts';

export abstract class HttpClientRuntimeException extends HttpRuntimeException implements HttpClientThrowable {}
