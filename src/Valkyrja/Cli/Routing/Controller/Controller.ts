import type { InputContract } from '../../Interaction/Input/Contract/InputContract.js';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.js';

export abstract class Controller {
    constructor(
        protected input: InputContract,
        protected outputFactory: OutputFactoryContract,
    ) {}
}
