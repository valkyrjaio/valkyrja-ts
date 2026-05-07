export enum TextColor {
    BLACK          = 30,
    RED            = 31,
    GREEN          = 32,
    YELLOW         = 33,
    BLUE           = 34,
    MAGENTA        = 35,
    CYAN           = 36,
    WHITE          = 37,
    DARK_GRAY      = 90,
    LIGHT_RED      = 91,
    LIGHT_GREEN    = 92,
    LIGHT_YELLOW   = 93,
    LIGHT_BLUE     = 94,
    LIGHT_MAGENTA  = 95,
    LIGHT_CYAN     = 96,
    LIGHT_WHITE    = 97,
}

export namespace TextColor {
    export function getDefault(): number {
        return 39;
    }
}