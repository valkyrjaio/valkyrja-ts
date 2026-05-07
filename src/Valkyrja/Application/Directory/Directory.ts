export class Directory {
    static basePath            = process.cwd();
    static appPath             = 'app';
    static dataPath            = 'data';
    static envPath             = 'env';
    static publicPath          = 'public';
    static resourcesPath       = 'resources';
    static srcPath             = 'src';
    static storagePath         = 'storage';
    static frameworkStoragePath = 'framework';
    static cacheStoragePath    = 'cache';
    static logsStoragePath     = 'logs';
    static testsPath           = 'tests';
    static vendorPath          = 'node_modules';

    static appDirectory(path?: string): string {
        return Directory.baseDirectory(Directory.appPath + Directory.path(path));
    }

    static baseDirectory(path?: string): string {
        return Directory.basePath + Directory.path(path);
    }

    static path(path?: string): string {
        return path !== undefined && path !== '' && !path.startsWith('/')
            ? '/' + path
            : path ?? '';
    }

    static dataDirectory(path?: string): string {
        return Directory.baseDirectory(Directory.dataPath + Directory.path(path));
    }

    static envDirectory(path?: string): string {
        return Directory.baseDirectory(Directory.envPath + Directory.path(path));
    }

    static publicDirectory(path?: string): string {
        return Directory.baseDirectory(Directory.publicPath + Directory.path(path));
    }

    static resourcesDirectory(path?: string): string {
        return Directory.baseDirectory(Directory.resourcesPath + Directory.path(path));
    }

    static srcDirectory(path?: string): string {
        return Directory.baseDirectory(Directory.srcPath + Directory.path(path));
    }

    static storageDirectory(path?: string): string {
        return Directory.baseDirectory(Directory.storagePath + Directory.path(path));
    }

    static frameworkStorageDirectory(path?: string): string {
        return Directory.storageDirectory(Directory.frameworkStoragePath + Directory.path(path));
    }

    static logsStorageDirectory(path?: string): string {
        return Directory.storageDirectory(Directory.logsStoragePath + Directory.path(path));
    }

    static frameworkStorageCacheDirectory(path?: string): string {
        return Directory.frameworkStorageDirectory(Directory.cacheStoragePath + Directory.path(path));
    }

    static testsDirectory(path?: string): string {
        return Directory.baseDirectory(Directory.testsPath + Directory.path(path));
    }

    static vendorDirectory(path?: string): string {
        return Directory.baseDirectory(Directory.vendorPath + Directory.path(path));
    }
}