import {isNotNull} from "@softwareventures/nullable";

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

export function notEmpty(iterable: Iterable<unknown>): boolean {
    return !empty(iterable);
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

export function sliceFn<T>(start: number, end = Infinity): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => slice(iterable, start, end);
}

export function take<T>(iterable: Iterable<T>, count: number): Iterable<T> {
    return slice(iterable, 0, count);
}

export function takeFn<T>(count: number): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => take(iterable, count);
}

export function drop<T>(iterable: Iterable<T>, count: number): Iterable<T> {
    return slice(iterable, count);
}

export function dropFn<T>(count: number): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => drop(iterable, count);
}

export function* takeWhile<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    let {done, value} = iterator.next();
    let i = 0;
    while (!done && predicate(value, i)) {
        yield value;
        ({done, value} = iterator.next());
        ++i;
    }
}

export function takeWhileFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => takeWhile(iterable, predicate);
}

export function* dropWhile<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    let {done, value} = iterator.next();
    let i = 0;
    while (!done && predicate(value, i)) {
        ({done, value} = iterator.next());
        ++i;
    }
    while (!done) {
        yield value;
        ({done, value} = iterator.next());
    }
}

export function dropWhileFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => dropWhile(iterable, predicate);
}

export function* map<T, U>(
    iterable: Iterable<T>,
    f: (element: T, index: number) => U
): Iterable<U> {
    let i = 0;
    for (const element of iterable) {
        yield f(element, i++);
    }
}

export function mapFn<T, U>(
    f: (element: T, index: number) => U
): (iterable: Iterable<T>) => Iterable<U> {
    return iterable => map(iterable, f);
}

export function filter<T, U extends T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => element is U
): Iterable<U>;
export function filter<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T>;
export function* filter<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    let i = 0;
    for (const element of iterable) {
        if (predicate(element, i++)) {
            yield element;
        }
    }
}

export function filterFn<T, U extends T>(
    predicate: (element: T, index: number) => element is U
): (iterable: Iterable<T>) => Iterable<U>;
export function filterFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T>;
export function filterFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => filter(iterable, predicate);
}

export function* filterFirst<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    let i = 0;
    let {done, value} = iterator.next();
    while (!done && predicate(value, i)) {
        yield value;
        ({done, value} = iterator.next());
        ++i;
    }
    ({done, value} = iterator.next());
    while (!done) {
        yield value;
        ({done, value} = iterator.next());
    }
}

export function filterFirstFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => filter(iterable, predicate);
}

export function exclude<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    return filter(iterable, (element, index) => !predicate(element, index));
}

export function excludeFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => exclude(iterable, predicate);
}

export function excludeNull<T>(iterable: Iterable<T | null | undefined>): Iterable<T> {
    return filter(iterable, isNotNull);
}

export function excludeFirst<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    return filterFirst(iterable, (element, i) => !predicate(element, i));
}

export function excludeFirstFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => excludeFirst(iterable, predicate);
}

export function remove<T>(iterable: Iterable<T>, value: T): Iterable<T> {
    return exclude(iterable, element => element === value);
}

export function removeFn<T>(value: T): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => remove(iterable, value);
}

export function removeFirst<T>(iterable: Iterable<T>, value: T): Iterable<T> {
    return excludeFirst(iterable, element => element === value);
}

export function removeFirstFn<T>(value: T): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => removeFirst(iterable, value);
}

export function fold<T, U>(
    iterable: Iterable<T>,
    f: (accumulator: U, element: T, index: number) => U,
    initial: U
): U {
    let i = 0;
    let result = initial;
    for (const element of iterable) {
        result = f(result, element, i++);
    }
    return result;
}

export function foldFn<T, U>(
    f: (accumulator: U, element: T, index: number) => U,
    initial: U
): (iterable: Iterable<T>) => U {
    return iterable => fold(iterable, f, initial);
}

export function contains<T>(iterable: Iterable<T>, value: T): boolean {
    for (const element of iterable) {
        if (element === value) {
            return true;
        }
    }
    return false;
}

export function containsFn<T>(value: T): (iterable: Iterable<T>) => boolean {
    return iterable => contains(iterable, value);
}

export function find<T, U extends T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => element is U
): U | null;
export function find<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): T | null;
export function find<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): T | null {
    let i = 0;
    for (const element of iterable) {
        if (predicate(element, i)) {
            return element;
        }
        ++i;
    }
    return null;
}

export function findFn<T, U extends T>(
    predicate: (element: T, index: number) => element is U
): (iterable: Iterable<T>) => U | null;
export function findFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => T | null;
export function findFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => T | null {
    return iterable => find(iterable, predicate);
}
