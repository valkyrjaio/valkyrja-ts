import type { CliConfigContract } from '../../../Application/Data/Contract/CliConfigContract.js';
import { ExitCode } from '../../Interaction/Enum/ExitCode.js';
import { TextColor } from '../../Interaction/Enum/TextColor.js';
import { TextColorFormat } from '../../Interaction/Format/TextColorFormat.js';
import { Formatter } from '../../Interaction/Formatter/Formatter.js';
import { HighlightedTextFormatter } from '../../Interaction/Formatter/HighlightedTextFormatter.js';
import { Banner } from '../../Interaction/Message/Banner.js';
import type { MessageContract } from '../../Interaction/Message/Contract/MessageContract.js';
import { ErrorMessage } from '../../Interaction/Message/ErrorMessage.js';
import { Header } from '../../Interaction/Message/Header.js';
import { Message } from '../../Interaction/Message/Message.js';
import { Messages } from '../../Interaction/Message/Messages.js';
import { NewLine } from '../../Interaction/Message/NewLine.js';
import type { OutputContract } from '../../Interaction/Output/Contract/OutputContract.js';
import type { OutputFactoryContract } from '../../Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import { HelpOptionParameter } from '../../Routing/Data/Option/HelpOptionParameter.js';
import { NoInteractionOptionParameter } from '../../Routing/Data/Option/NoInteractionOptionParameter.js';
import { QuietOptionParameter } from '../../Routing/Data/Option/QuietOptionParameter.js';
import { SilentOptionParameter } from '../../Routing/Data/Option/SilentOptionParameter.js';
import { VersionOptionParameter } from '../../Routing/Data/Option/VersionOptionParameter.js';
import type { ArgumentParameterContract } from '../../Routing/Data/Contract/ArgumentParameterContract.js';
import type { OptionParameterContract } from '../../Routing/Data/Contract/OptionParameterContract.js';
import type { RouteCollectionContract } from '../../Routing/Collection/Contract/RouteCollectionContract.js';
import type { RouteContract } from '../../Routing/Data/Contract/RouteContract.js';
import { ArgumentValueMode } from '../../Routing/Enum/ArgumentValueMode.js';
import { OptionMode } from '../../Routing/Enum/OptionMode.js';
import { OptionValueMode } from '../../Routing/Enum/OptionValueMode.js';

export class HelpCommand {
    protected helpRoute!: RouteContract;

    constructor(
        protected config: CliConfigContract,
        protected route: RouteContract,
        protected collection: RouteCollectionContract,
        protected outputFactory: OutputFactoryContract,
    ) {}

    static help(): MessageContract {
        return new Message('A command to get help for a specific command.');
    }

    run(): OutputContract {
        const commandName = this.route.getOption('command').getFirstValue();

        if (!this.collection.has(commandName)) {
            return this.outputFactory
                .createOutput()
                .withExitCode(ExitCode.ERROR)
                .withAddedMessages(new Banner(new ErrorMessage(`Command \`${commandName}\` was not found.`)));
        }

        this.helpRoute = this.collection.get(commandName);

        const output = this.outputFactory
            .createOutput()
            .withMessages(new Header(this.config.namespace, this.config.version, this.route));

        return this.getHelpText(output);
    }

    protected getHelpText(output: OutputContract): OutputContract {
        const route            = this.helpRoute;
        const argumentMessages = this.getArgumentsMessages();
        const optionMessages   = this.getOptionsMessages();

        output = output.withAddedMessages(
            new NewLine(),
            this.getNameMessages(),
            new NewLine(),
            new NewLine(),
            this.getDescriptionMessages(),
            new NewLine(),
            new NewLine(),
            this.getUsageMessages(),
            new NewLine(),
            new NewLine(),
            ...argumentMessages,
            ...optionMessages,
        );

        if (route.hasHelpText()) {
            const helpText = route.getHelpTextMessage();

            return output.withAddedMessages(
                this.getHelpTextMessages(helpText),
                new NewLine(),
            );
        }

        return output;
    }

    protected getOptionsMessages(): MessageContract[] {
        const route          = this.helpRoute;
        const optionMessages: MessageContract[] = [];

        if (route.hasOptions()) {
            optionMessages.push(this.getOptionsHeadingMessages());
            optionMessages.push(new NewLine());

            for (const option of route.getOptions()) {
                optionMessages.push(this.getOptionMessages(option));
            }
        }

        optionMessages.push(this.getGlobalOptionsHeadingMessages());
        optionMessages.push(new NewLine());
        optionMessages.push(this.getOptionMessages(new QuietOptionParameter()));
        optionMessages.push(this.getOptionMessages(new SilentOptionParameter()));
        optionMessages.push(this.getOptionMessages(new NoInteractionOptionParameter()));
        optionMessages.push(this.getOptionMessages(new HelpOptionParameter()));
        optionMessages.push(this.getOptionMessages(new VersionOptionParameter()));

        return optionMessages;
    }

    protected getArgumentsMessages(): MessageContract[] {
        const route              = this.helpRoute;
        const argumentMessages: MessageContract[] = [];

        if (route.hasArguments()) {
            argumentMessages.push(this.getArgumentsHeadingMessages());
            argumentMessages.push(new NewLine());

            for (const argument of route.getArguments()) {
                argumentMessages.push(this.getArgumentMessages(argument));
            }
        }

        return argumentMessages;
    }

    protected getNameMessages(): Messages {
        return new Messages(
            new Message('Name: ', new HighlightedTextFormatter()),
            new Message(this.helpRoute.getName()),
        );
    }

    protected getDescriptionMessages(): Messages {
        return new Messages(
            new Message('Description:', new HighlightedTextFormatter()),
            new NewLine(),
            this.getIndentedText(new Message(this.helpRoute.getDescription())),
        );
    }

    protected getHelpTextMessages(helpText: MessageContract): Messages {
        return new Messages(
            new Message('Help:', new HighlightedTextFormatter()),
            new NewLine(),
            this.getIndentedText(helpText),
            new NewLine(),
        );
    }

    protected getUsageMessages(): Messages {
        const route = this.helpRoute;
        let usage   = route.getName();

        if (route.hasOptions()) {
            usage += ' [options]';
        }

        usage += ' [global options]';

        if (route.hasArguments()) {
            for (const argument of route.getArguments()) {
                usage += ' ['
                    + argument.getName()
                    + (argument.getValueMode() === ArgumentValueMode.ARRAY ? '...' : '')
                    + ']';
            }
        }

        return new Messages(
            new Message('Usage:', new HighlightedTextFormatter()),
            new NewLine(),
            this.getIndentedText(new Message(usage)),
        );
    }

    protected getOptionsHeadingMessages(): Messages {
        return new Messages(new Message('Options:', new HighlightedTextFormatter()));
    }

    protected getGlobalOptionsHeadingMessages(): Messages {
        return new Messages(new Message('Global Options:', new HighlightedTextFormatter()));
    }

    protected getOptionMessages(option: OptionParameterContract): Messages {
        const msgs: MessageContract[] = [];

        msgs.push(new Message('  '));
        msgs.push(new Message('--' + option.getName(), new Formatter(new TextColorFormat(TextColor.MAGENTA))));

        this.addShortNamesOptionMessages(msgs, option);
        this.addValueDisplayNameOptionMessages(msgs, option);

        msgs.push(new NewLine());
        msgs.push(new Message('    '));
        msgs.push(new Message(option.getDescription()));

        this.addValidValuesOptionMessages(msgs, option);

        msgs.push(new NewLine());
        msgs.push(new NewLine());

        return new Messages(...msgs);
    }

    protected addShortNamesOptionMessages(messages: MessageContract[], option: OptionParameterContract): void {
        const shortNames = option.getShortNames();

        if (shortNames.length > 0) {
            messages.push(new Message(', '));
            messages.push(new Message('-' + shortNames.join('|'), new Formatter(new TextColorFormat(TextColor.MAGENTA))));
        }
    }

    protected addValueDisplayNameOptionMessages(messages: MessageContract[], option: OptionParameterContract): void {
        if (option.hasValueDisplayName()) {
            const valueDisplayName = option.getValueDisplayName();

            messages.push(new Message(' '));

            let text = '';

            if (option.getValueMode() === OptionValueMode.ARRAY) {
                text = '...';
            }

            if (option.getMode() === OptionMode.REQUIRED) {
                text += '=' + valueDisplayName;
            } else {
                text += '[=' + valueDisplayName + ']';
            }

            messages.push(new Message(text, new HighlightedTextFormatter()));
        }
    }

    protected addValidValuesOptionMessages(messages: MessageContract[], option: OptionParameterContract): void {
        const validValues = option.getValidValues();

        if (validValues.length > 0) {
            const defaultValue  = option.getDefaultValue();
            const valueSpacing  = '\n      - ';

            messages.push(new NewLine());
            messages.push(new NewLine());
            messages.push(new Message('    '));
            messages.push(new Message('Valid values:'));

            for (const validValue of validValues) {
                messages.push(new Message(`${valueSpacing}\`${validValue}\``));

                if (validValue === defaultValue) {
                    messages.push(new Message(' (default)', new HighlightedTextFormatter()));
                }
            }
        }
    }

    protected getArgumentsHeadingMessages(): Messages {
        return new Messages(new Message('Arguments:', new HighlightedTextFormatter()));
    }

    protected getArgumentMessages(argument: ArgumentParameterContract): Messages {
        return new Messages(
            new Message('  '),
            new Message(argument.getName()),
            new NewLine(),
            new Message('    '),
            new Message(argument.getDescription()),
            new NewLine(),
            new NewLine(),
        );
    }

    protected getIndentedText(message: MessageContract): MessageContract {
        const spaces      = '  ';
        const maxWidth    = 100;
        const words       = (spaces + message.getText()).split(' ');
        const lines: string[] = [];
        let currentLine   = '';

        for (const word of words) {
            if (currentLine.length + word.length + 1 <= maxWidth) {
                currentLine += (currentLine ? ' ' : '') + word;
            } else {
                lines.push(currentLine);
                currentLine = spaces + word;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return message.withText(lines.join('\n'));
    }
}