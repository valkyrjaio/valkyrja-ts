export interface UrlContract {
    getUrl(name: string, data: Record<string, string | number>): string;
}
