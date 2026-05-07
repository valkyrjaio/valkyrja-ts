import { CliRuntimeException } from '../../../../../Throwable/Exception/Abstract/CliRuntimeException.js';

import type { CliServerThrowable } from '../../Contract/CliServerThrowable.js';

export abstract class CliServerRuntimeException extends CliRuntimeException implements CliServerThrowable {}