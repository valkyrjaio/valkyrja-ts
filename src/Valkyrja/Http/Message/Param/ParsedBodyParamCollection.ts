import type { ParsedBodyParamCollectionContract } from './Contract/ParsedBodyParamCollectionContract.js';
import { ParamCollection } from './Abstract/ParamCollection.js';

export class ParsedBodyParamCollection
    extends ParamCollection<string | string[]>
    implements ParsedBodyParamCollectionContract {}
