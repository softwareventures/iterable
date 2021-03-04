export function isIterable<T = unknown>(value: Iterable<T> | unknown): value is Iterable<T> {
    return typeof value === "object" && value != null && Symbol.iterator in value;
}

export function iterator<T>(iterable: Iterable<T>): Iterator<T> {
    return iterable[Symbol.iterator]();
}

export function first<T>(iterable: Iterable<T>): T | null {
    const iterator = iterable[Symbol.iterator]();
    const {done, value} = iterator.next();
    if (done) {
        return null;
    } else {
        return value;
    }
}
