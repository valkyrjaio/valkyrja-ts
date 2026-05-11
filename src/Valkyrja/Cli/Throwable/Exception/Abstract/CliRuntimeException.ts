import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.js';

import type { CliThrowable } from '../../Contract/CliThrowable.js';

export abstract class CliRuntimeException extends ValkyrjaRuntimeException implements CliThrowable {}
