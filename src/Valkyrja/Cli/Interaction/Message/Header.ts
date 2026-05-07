import { ApplicationInfo } from '../../../../Application/Constant/ApplicationInfo.js';
import type { RouteContract } from '../../../Routing/Data/Contract/RouteContract.js';
import { Message } from './Message.js';

export class Header extends Message {
    constructor(
        protected appName: string,
        protected appVersion: string,
        route: RouteContract,
        protected icon: string = ApplicationInfo.ICON,
        protected valkyrjaVersion: string = ApplicationInfo.VERSION,
        protected valkyrjaBuildDate: string = ApplicationInfo.VERSION_BUILD_DATE_TIME,
        protected nodeVersion: string = process.version,
        protected projectRoot: string = '',
        protected actionDescription: string = '',
        protected commandName: string = '',
    ) {
        super('');

        if (this.projectRoot === '') {
            this.projectRoot = process.cwd();
        }

        if (this.actionDescription === '') {
            this.actionDescription = route.getDescription();
        }

        if (this.commandName === '') {
            this.commandName = route.getName();
        }
    }

    withAppName(appName: string): this {
        const clone      = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.appName    = appName;
        return clone;
    }

    withAppVersion(appVersion: string): this {
        const clone         = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.appVersion    = appVersion;
        return clone;
    }

    withIcon(icon: string): this {
        const clone  = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.icon   = icon;
        return clone;
    }

    withValkyrjaVersion(valkyrjaVersion: string): this {
        const clone               = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.valkyrjaVersion     = valkyrjaVersion;
        return clone;
    }

    withValkyrjaBuildDate(valkyrjaBuildDate: string): this {
        const clone                 = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.valkyrjaBuildDate     = valkyrjaBuildDate;
        return clone;
    }

    withNodeVersion(nodeVersion: string): this {
        const clone           = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.nodeVersion     = nodeVersion;
        return clone;
    }

    withProjectRoot(projectRoot: string): this {
        const clone           = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.projectRoot     = projectRoot;
        return clone;
    }

    withActionDescription(actionDescription: string): this {
        const clone                 = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.actionDescription     = actionDescription;
        return clone;
    }

    withCommandName(commandName: string): this {
        const clone           = Object.assign(Object.create(Object.getPrototypeOf(this)) as this, this);
        clone.commandName     = commandName;
        return clone;
    }

    getText(): string {
        const iconLines = this.icon.split('\n').map((line) => `│   ${line}`);

        return [
            `╭── ${this.appName} v${this.appVersion}`,
            '│',
            ...iconLines,
            '│',
            `│   Built on Valkyrja v${this.valkyrjaVersion} (date: ${this.valkyrjaBuildDate})`,
            `│   Running on Node ${this.nodeVersion}`,
            `│   ${this.projectRoot}`,
            `╰── ${this.actionDescription} · ${this.commandName}`,
        ].join('\n');
    }
}