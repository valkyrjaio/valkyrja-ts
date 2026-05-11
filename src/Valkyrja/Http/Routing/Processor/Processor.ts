import { Regex } from '../Constant/Regex.js';
import { HttpRoutingInvalidRoutePathException } from '../Throwable/Exception/HttpRoutingInvalidRoutePathException.js';

import type { DynamicRouteContract } from '../Data/Contract/DynamicRouteContract.js';
import type { ParameterContract } from '../Data/Contract/ParameterContract.js';
import type { RouteContract } from '../Data/Contract/RouteContract.js';
import type { ProcessorContract } from './Contract/ProcessorContract.js';

export class Processor implements ProcessorContract {
    route(route: RouteContract): RouteContract {
        const path = '/' + route.getPath().replace(/^\/+|\/+$/g, '');

        route = route.withPath(path);

        if (this.isDynamicRoute(route) && route.getPath().includes('{')) {
            route = this.modifyRegex(route as DynamicRouteContract);
        }

        return route;
    }

    protected isDynamicRoute(route: RouteContract): route is DynamicRouteContract {
        return 'getRegex' in route && typeof (route as DynamicRouteContract).getRegex === 'function';
    }

    protected modifyRegex(route: DynamicRouteContract): RouteContract {
        if (route.getRegex() !== '') {
            return route;
        }

        let regex = route.getPath().replace(/\//g, Regex.PATH);

        const parameters = route.getParameters();

        for (const parameter of parameters) {
            const processed = this.processParameterInRegex(parameter, regex);

            regex = this.replaceParameterNameInRegex(route, processed, regex);
        }

        regex = Regex.START + regex + Regex.END;

        return route.withRegex(regex);
    }

    protected processParameterInRegex(parameter: ParameterContract, regex: string): ParameterContract {
        if (parameter.isOptional() || regex.includes(parameter.getName() + '?')) {
            return parameter.withIsOptional(true);
        }

        return parameter;
    }

    protected replaceParameterNameInRegex(route: RouteContract, parameter: ParameterContract, regex: string): string {
        const nameReplacement = this.getRegexParameterNameReplacement(parameter);

        if (!regex.includes(nameReplacement)) {
            throw new HttpRoutingInvalidRoutePathException(`${route.getPath()} is missing ${nameReplacement}`);
        }

        const parameterRegex = this.getParameterRegex(parameter);

        return regex.replace(nameReplacement, parameterRegex);
    }

    protected getRegexParameterNameReplacement(parameter: ParameterContract): string {
        const isOptional = parameter.isOptional();

        return (isOptional ? Regex.PATH : '')
            + '{' + parameter.getName() + (isOptional ? '?' : '') + '}';
    }

    protected getParameterRegex(parameter: ParameterContract): string {
        return this.getParameterRegexOptionalCaptureGroupStart(parameter)
            + this.getParameterRegexCaptureGroupStart(parameter)
            + this.getParameterRegexNameCaptureGroup(parameter)
            + parameter.getRegex()
            + this.getParameterRegexCaptureGroupEnd(parameter);
    }

    protected getParameterRegexOptionalCaptureGroupStart(parameter: ParameterContract): string {
        return parameter.isOptional() ? Regex.START_OPTIONAL_CAPTURE_GROUP : '';
    }

    protected getParameterRegexCaptureGroupStart(parameter: ParameterContract): string {
        return !parameter.shouldCapture()
            ? Regex.START_NON_CAPTURE_GROUP
            : Regex.START_CAPTURE_GROUP;
    }

    protected getParameterRegexNameCaptureGroup(parameter: ParameterContract): string {
        return parameter.shouldCapture()
            ? Regex.START_CAPTURE_GROUP_NAME + parameter.getName() + Regex.END_CAPTURE_GROUP_NAME
            : '';
    }

    protected getParameterRegexCaptureGroupEnd(parameter: ParameterContract): string {
        return parameter.isOptional()
            ? Regex.END_OPTIONAL_CAPTURE_GROUP
            : Regex.END_CAPTURE_GROUP;
    }
}
