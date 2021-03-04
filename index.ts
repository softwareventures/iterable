export function isIterable<T = unknown>(value: Iterable<T> | unknown): value is Iterable<T> {
    return typeof value === "object" && value != null && Symbol.iterator in value;
}

export function iterator<T>(iterable: Iterable<T>): Iterator<T> {
    return iterable[Symbol.iterator]();
}

export function toArray<T>(iterable: Iterable<T>): T[] {
    return Array.from(iterable);
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

export function* tail<T>(iterable: Iterable<T>): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    let {done, value} = iterator.next();
    while (!done) {
        ({done, value} = iterator.next());
        if (!done) {
            yield value;
        }
    }
}

export function* initial<T>(iterable: Iterable<T>): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    let {done, value} = iterator.next();
    let nextValue: T | null = null;
    if (!done) {
        ({done, value: nextValue} = iterator.next());
    }
    while (!done) {
        yield value;
        value = nextValue;
        ({done, value: nextValue} = iterator.next());
    }
}
