import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.js';

import { type ContainerThrowable } from '../../Contract/ContainerThrowable.js';

export abstract class ContainerRuntimeException extends ValkyrjaRuntimeException implements ContainerThrowable {}
