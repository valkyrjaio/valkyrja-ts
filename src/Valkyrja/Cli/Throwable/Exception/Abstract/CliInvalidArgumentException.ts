import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.js';

import type { CliThrowable } from '../../Contract/CliThrowable.js';

export abstract class CliInvalidArgumentException extends ValkyrjaInvalidArgumentException implements CliThrowable {}