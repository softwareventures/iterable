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

export function tail<T>(iterable: Iterable<T>): Iterable<T> {
    return slice(iterable, 1);
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

export function last<T>(iterable: Iterable<T>): T | null {
    const iterator = iterable[Symbol.iterator]();
    let done: boolean | undefined = false;
    let result: T | null = null;
    let value: T | null = null;
    while (!done) {
        result = value;
        ({done, value} = iterator.next());
    }
    return result;
}

export function empty(iterable: Iterable<unknown>): boolean {
    return iterable[Symbol.iterator]().next().done ?? false;
}

export function* slice<T>(iterable: Iterable<T>, start = 0, end = Infinity): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    for (let i = 0; i < start; ++i) {
        const {done} = iterator.next();
        if (done) {
            return;
        }
    }
    for (let i = start; i < end; ++i) {
        const {done, value} = iterator.next();
        if (done) {
            return;
        }
        yield value;
    }
}
