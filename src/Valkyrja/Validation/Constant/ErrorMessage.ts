export class ErrorMessage {
    static readonly REQUIRED              = 'This field is required.';
    static readonly INT_GREATER_THAN      = 'This field value is too low.';
    static readonly INT_LESS_THAN         = 'This field value is too high.';
    static readonly IS_EMAIL              = 'This field must be a valid email.';
    static readonly IS_EQUAL              = 'This field must be the same.';
    static readonly IS_BOOL               = 'This field must be a boolean.';
    static readonly IS_EMPTY              = 'This field must be empty.';
    static readonly IS_NUMERIC            = 'This field must be numeric.';
    static readonly IS_STRING             = 'This field must be a string.';
    static readonly IS_NOT_EMPTY          = 'This field must not be empty.';
    static readonly IS_NOT_EQUAL          = 'This field must not be the same.';
    static readonly ENTITY_EXISTS         = 'This field must match an existing entity.';
    static readonly ENTITY_NOT_EXISTS     = 'This field must not match an existing entity.';
    static readonly STRING_ALPHA          = 'This field must be alphanumeric.';
    static readonly STRING_CONTAINS       = 'This field must contain another string.';
    static readonly STRING_ENDS_WITH      = 'This field must end with another string.';
    static readonly STRING_LOWERCASE      = 'This field must be lowercase.';
    static readonly STRING_MAX            = 'This field is too long.';
    static readonly STRING_MIN            = 'This field is too short.';
    static readonly STRING_REGEX          = 'This field must match the regex.';
    static readonly STRING_STARTS_WITH    = 'This field must start with another string.';
    static readonly STRING_UPPERCASE      = 'This field must be uppercase.';
}