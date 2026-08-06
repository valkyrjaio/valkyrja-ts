/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

export class ApplicationInfo {
    static readonly VERSION = '26.6.5' as const;
    static readonly VERSION_BUILD_DATE_TIME = 'August 6 2026 08:18:50 MST' as const;
    static readonly ASCII = `
                 _ _               _
     /\\   /\\__ _| | | ___   _ _ __(_) __ _
     \\ \\ / / _\` | | |/ / | | | '__| |/ _\` |
      \\ V / (_| | |   <| |_| | |  | | (_| |
       \\_/ \\__,_|_|_|\\_\\\\__, |_| _/ |\\__,_|
                        |___/   |__/
    ` as const;
    static readonly ICON = `\
    ▗▄▄▖     ▗▄▄▖
    ▝▜██▄▄▄▄▄██▛▘
       ▝▜███▛▘
          █` as const;
}
