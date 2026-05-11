export interface ComponentContract {
    getToken(): string;
    withToken(token: string): this;
    getText(): string;
    withText(text: string): this;
    toString(): string;
}