export enum Style {
    BOLD       = 1,
    UNDERSCORE = 4,
    BLINK      = 5,
    INVERSE    = 7,
    CONCEAL    = 8,
}

export namespace Style {
    export function getDefault(style: Style): number {
        switch (style) {
            case Style.BOLD:       return 22;
            case Style.UNDERSCORE: return 24;
            case Style.BLINK:      return 25;
            case Style.INVERSE:    return 27;
            case Style.CONCEAL:    return 28;
        }
    }
}