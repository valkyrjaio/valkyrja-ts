import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.js';

import { type ContainerThrowable } from '../../Contract/ContainerThrowable.js';

export abstract class ContainerInvalidArgumentException extends ValkyrjaInvalidArgumentException implements ContainerThrowable {}
