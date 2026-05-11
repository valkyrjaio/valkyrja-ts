import type { CookieParamCollectionContract } from './Contract/CookieParamCollectionContract.js';
import { ParamCollection } from './Abstract/ParamCollection.js';

export class CookieParamCollection extends ParamCollection<string> implements CookieParamCollectionContract {}