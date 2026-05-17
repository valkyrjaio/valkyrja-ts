export class ObjectFactory {
    static clone<T extends object>(object: T): T {
        return Object.assign(Object.create(Object.getPrototypeOf(object) as object | null) as T, object);
    }
}
