const UUID_PART = '[0-9A-Fa-f]';
const ULID_VLID_CHARS = '0123456789ABCDEFGHJKMNPQRSTVWXYZabcdefghjkmnpqrstvwxyz';

export class Regex {
    static readonly PATH = '\\/';
    static readonly ANY = '.*';
    static readonly NUM = '\\d+';

    static readonly ID = Regex.NUM;

    static readonly SLUG = '[a-zA-Z0-9-]+';

    static readonly UUID = `${UUID_PART}{8}-${UUID_PART}{4}-${UUID_PART}{4}-${UUID_PART}{4}-${UUID_PART}{12}`;
    static readonly UUID_V1 = `${UUID_PART}{8}-${UUID_PART}{4}-[1]${UUID_PART}{3}-${UUID_PART}{4}-${UUID_PART}{12}`;
    static readonly UUID_V3 = `${UUID_PART}{8}-${UUID_PART}{4}-[3]${UUID_PART}{3}-${UUID_PART}{4}-${UUID_PART}{12}`;
    static readonly UUID_V4 = `${UUID_PART}{8}-${UUID_PART}{4}-[4]${UUID_PART}{3}-${UUID_PART}{4}-${UUID_PART}{12}`;
    static readonly UUID_V5 = `${UUID_PART}{8}-${UUID_PART}{4}-[5]${UUID_PART}{3}-${UUID_PART}{4}-${UUID_PART}{12}`;
    static readonly UUID_V6 = `${UUID_PART}{8}-${UUID_PART}{4}-[6]${UUID_PART}{3}-${UUID_PART}{4}-${UUID_PART}{12}`;
    static readonly UUID_V7 = `${UUID_PART}{8}-${UUID_PART}{4}-[7]${UUID_PART}{3}-${UUID_PART}{4}-${UUID_PART}{12}`;
    static readonly UUID_V8 = `${UUID_PART}{8}-${UUID_PART}{4}-[8]${UUID_PART}{3}-${UUID_PART}{4}-${UUID_PART}{12}`;

    static readonly ULID = `[0-7][${ULID_VLID_CHARS}]{25}`;

    static readonly VLID = `[0-7][${ULID_VLID_CHARS}]{12}[1-4][${ULID_VLID_CHARS}]{4}([${ULID_VLID_CHARS}]{4})?([${ULID_VLID_CHARS}]{4})?([${ULID_VLID_CHARS}]{4})?`;
    static readonly VLID_V1 = `[0-7][${ULID_VLID_CHARS}]{12}[1][${ULID_VLID_CHARS}]{12}`;
    static readonly VLID_V2 = `[0-7][${ULID_VLID_CHARS}]{12}[2][${ULID_VLID_CHARS}]{16}`;
    static readonly VLID_V3 = `[0-7][${ULID_VLID_CHARS}]{12}[3][${ULID_VLID_CHARS}]{8}`;
    static readonly VLID_V4 = `[0-7][${ULID_VLID_CHARS}]{12}[4][${ULID_VLID_CHARS}]{4}`;

    static readonly ALPHA = '[a-zA-Z]+';
    static readonly ALPHA_LOWERCASE = '[a-z]+';
    static readonly ALPHA_UPPERCASE = '[A-Z]+';
    static readonly ALPHA_NUM = '[a-zA-Z0-9]+';
    static readonly ALPHA_NUM_UNDERSCORE = '\\w+';

    static readonly START = '/^';
    static readonly END = '$/';

    static readonly START_CAPTURE_GROUP = '(';
    static readonly START_NON_CAPTURE_GROUP = '(?:';
    static readonly END_CAPTURE_GROUP = ')';
    static readonly END_OPTIONAL_CAPTURE_GROUP = ')?';
    static readonly START_OPTIONAL_CAPTURE_GROUP =
        Regex.START_NON_CAPTURE_GROUP + Regex.PATH + Regex.END_OPTIONAL_CAPTURE_GROUP;

    static readonly START_CAPTURE_GROUP_NAME = '?<';
    static readonly END_CAPTURE_GROUP_NAME = '>';
}
