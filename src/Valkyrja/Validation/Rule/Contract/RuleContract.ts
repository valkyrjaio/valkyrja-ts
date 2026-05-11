export interface RuleContract {
    getSubject(): unknown;
    isValid(): boolean;
    validate(): void;
}