export enum Mode {
    READ              = 'r',
    READ_WRITE        = 'r+',
    WRITE             = 'w',
    WRITE_READ        = 'w+',
    WRITE_END         = 'a',
    WRITE_READ_END    = 'a+',
    CREATE_WRITE      = 'x',
    CREATE_WRITE_READ = 'x+',
    WRITE_CREATE      = 'c',
    WRITE_READ_CREATE = 'c+',
    CLOSE_ON_EXEC     = 'e',
}

export function modeIsReadable(mode: Mode): boolean {
    return [
        Mode.READ,
        Mode.READ_WRITE,
        Mode.WRITE_READ,
        Mode.WRITE_READ_END,
        Mode.CREATE_WRITE_READ,
        Mode.WRITE_READ_CREATE,
    ].includes(mode);
}

export function modeIsWritable(mode: Mode): boolean {
    return [
        Mode.READ_WRITE,
        Mode.WRITE,
        Mode.WRITE_READ,
        Mode.WRITE_END,
        Mode.WRITE_READ_END,
        Mode.CREATE_WRITE,
        Mode.CREATE_WRITE_READ,
        Mode.WRITE_CREATE,
        Mode.WRITE_READ_CREATE,
    ].includes(mode);
}