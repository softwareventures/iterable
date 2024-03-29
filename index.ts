import {isNotNull} from "@softwareventures/nullable";
import type {Comparator} from "@softwareventures/ordered";
import {compare as defaultCompare} from "@softwareventures/ordered";

// eslint-disable-next-line @typescript-eslint/ban-types
export function isIterable<T>(value: Iterable<T> | {} | null | undefined): value is Iterable<T> {
    return (
        typeof value === "object" &&
        value != null &&
        Symbol.iterator in value &&
        typeof (value as {[Symbol.iterator]: unknown})[Symbol.iterator] === "function"
    );
}

export function iterator<T>(iterable: Iterable<T>): Iterator<T> {
    return iterable[Symbol.iterator]();
}

export function toArray<T>(iterable: Iterable<T>): T[] {
    return Array.from(iterable);
}

export function toSet<T>(iterable: Iterable<T>): Set<T> {
    return new Set(iterable);
}

export function first<T>(iterable: Iterable<T>): T | null {
    for (const element of iterable) {
        return element;
    }
    return null;
}

export function tail<T>(iterable: Iterable<T>): Iterable<T> {
    return slice(iterable, 1);
}

export function* push<T>(iterable: Iterable<T>, value: T): Iterable<T> {
    for (const element of iterable) {
        yield element;
    }
    yield value;
}

export function pushFn<T>(value: T): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => push(iterable, value);
}

export function* unshift<T>(iterable: Iterable<T>, value: T): Iterable<T> {
    yield value;
    for (const element of iterable) {
        yield element;
    }
}

export function unshiftFn<T>(value: T): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => unshift(iterable, value);
}

export function* initial<T>(iterable: Iterable<T>): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    let prev = iterator.next();
    let element = prev.done === true ? prev : iterator.next();

    while (element.done !== true) {
        yield prev.value;
        prev = element;
        element = iterator.next();
    }
}

export function last<T>(iterable: Iterable<T>): T | null {
    let last: T | null = null;

    for (const element of iterable) {
        last = element;
    }

    return last;
}

export function only<T>(iterable: Iterable<T>): T | null {
    const iterator = iterable[Symbol.iterator]();
    const first = iterator.next();
    return !(first.done ?? false) && (iterator.next().done ?? false) ? first.value : null;
}

export function empty(iterable: Iterable<unknown>): boolean {
    return iterable[Symbol.iterator]().next().done ?? false;
}

export function notEmpty(iterable: Iterable<unknown>): boolean {
    return !empty(iterable);
}

export function reverse<T>(iterable: Iterable<T>): T[] {
    return toArray(iterable).reverse();
}

export function* slice<T>(iterable: Iterable<T>, start = 0, end = Infinity): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    for (let i = 0; i < start; ++i) {
        const {done} = iterator.next();
        if (done === true) {
            return;
        }
    }
    for (let i = start; i < end; ++i) {
        const element = iterator.next();
        if (element.done === true) {
            return;
        }
        yield element.value;
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

export function takeWhile<T, U extends T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => element is U
): Iterable<U>;
export function takeWhile<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T>;
export function* takeWhile<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    let i = 0;
    for (const element of iterable) {
        if (!predicate(element, i++)) {
            return;
        }
        yield element;
    }
}

export function takeWhileFn<T, U extends T>(
    predicate: (element: T, index: number) => element is U
): (iterable: Iterable<T>) => Iterable<U>;
export function takeWhileFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T>;
export function takeWhileFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => takeWhile(iterable, predicate);
}

export function takeUntil<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    return takeWhile(iterable, (element, index) => !predicate(element, index));
}

export function takeUntilFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => takeUntil(iterable, predicate);
}

export function* dropWhile<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    let element = iterator.next();
    for (let i = 0; element.done !== true && predicate(element.value, i); ++i) {
        element = iterator.next();
    }

    while (element.done !== true) {
        yield element.value;
        element = iterator.next();
    }
}

export function dropWhileFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => dropWhile(iterable, predicate);
}

export function dropUntil<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    return dropWhile(iterable, (element, index) => !predicate(element, index));
}

export function dropUntilFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => dropUntil(iterable, predicate);
}

/** Creates a new `Iterable` populated with the result of calling the function
 * `f` on every element of `iterable`. */
export function* map<T, U>(
    iterable: Iterable<T>,
    f: (element: T, index: number) => U
): Iterable<U> {
    let i = 0;
    for (const element of iterable) {
        yield f(element, i++);
    }
}

/** Curried variant of {@link map}.
 *
 * Returns a function that creates a new `Iterable` populated with the result
 * of calling the function `f` on every element of`iterable`. */
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

/** @deprecated This function is confusing, use {@link excludeFirst} instead,
 * and invert the predicate. */
export function filterFirst<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    return excludeFirst(iterable, (element, index) => !predicate(element, index));
}

/** @deprecated This function is confusing, use {@link excludeFirstFn} instead,
 * and invert the predicate. */
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

export function* excludeFirst<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    let element = iterator.next();

    for (let i = 0; element.done !== true; ++i) {
        if (predicate(element.value, i)) {
            break;
        }
        yield element.value;
        element = iterator.next();
    }

    if (element.done !== true) {
        element = iterator.next();
    }

    while (element.done !== true) {
        yield element.value;
        element = iterator.next();
    }
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

export function fold1<T>(
    iterable: Iterable<T>,
    f: (accumulator: T, element: T, index: number) => T
): T | null {
    let result: T | null = null;
    for (const element of scan1(iterable, f)) {
        result = element;
    }
    return result;
}

export function fold1Fn<T>(
    f: (accumulator: T, element: T, index: number) => T
): (iterable: Iterable<T>) => T | null {
    return iterable => fold1(iterable, f);
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

export function maximum<T extends string | number | boolean>(iterable: Iterable<T>): T | null;
export function maximum<T>(iterable: Iterable<T>, compare: Comparator<T>): T | null;
export function maximum<T>(iterable: Iterable<T>, compare?: Comparator<T>): T | null {
    return internalMaximum(iterable, compare ?? (defaultCompare as unknown as Comparator<T>));
}

export function maximumFn<T>(compare: Comparator<T>): (iterable: Iterable<T>) => T | null {
    return iterable => internalMaximum(iterable, compare);
}

function internalMaximum<T>(iterable: Iterable<T>, compare: Comparator<T>): T | null {
    return fold1(iterable, (a, e) => (compare(e, a) > 0 ? e : a));
}

export function maximumBy<T>(iterable: Iterable<T>, select: (element: T) => number): T | null {
    return maximum(iterable, (a, b) => defaultCompare(select(a), select(b)));
}

export function maximumByFn<T>(
    select: (element: T) => number
): (iterable: Iterable<T>) => T | null {
    return iterable => maximumBy(iterable, select);
}

export function minimum<T extends string | number | boolean>(iterable: Iterable<T>): T | null;
export function minimum<T>(iterable: Iterable<T>, compare: Comparator<T>): T | null;
export function minimum<T>(iterable: Iterable<T>, compare?: Comparator<T>): T | null {
    return internalMinimum(iterable, compare ?? (defaultCompare as unknown as Comparator<T>));
}

export function minimumFn<T>(compare: Comparator<T>): (iterable: Iterable<T>) => T | null {
    return iterable => internalMinimum(iterable, compare);
}

function internalMinimum<T>(iterable: Iterable<T>, compare: Comparator<T>): T | null {
    return fold1(iterable, (a, e) => (compare(e, a) < 0 ? e : a));
}

export function minimumBy<T>(iterable: Iterable<T>, select: (element: T) => number): T | null {
    return minimum(iterable, (a, b) => defaultCompare(select(a), select(b)));
}

export function minimumByFn<T>(
    select: (element: T) => number
): (iterable: Iterable<T>) => T | null {
    return iterable => minimumBy(iterable, select);
}

export function sum(iterable: Iterable<number>): number {
    return fold(iterable, (a, e) => a + e, 0);
}

export function product(iterable: Iterable<number>): number {
    return fold(iterable, (a, e) => a * e, 1);
}

export function and(iterable: Iterable<boolean>): boolean {
    return all(iterable, e => e);
}

export function or(iterable: Iterable<boolean>): boolean {
    return any(iterable, e => e);
}

export function any<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): boolean {
    let i = 0;
    for (const element of iterable) {
        if (predicate(element, i)) {
            return true;
        }
        ++i;
    }
    return false;
}

export function anyFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => boolean {
    return iterable => any(iterable, predicate);
}

export function all<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): boolean {
    return !any(iterable, (e, i) => !predicate(e, i));
}

export function allFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => boolean {
    return iterable => all(iterable, predicate);
}

export function* concat<T>(iterables: Iterable<Iterable<T>>): Iterable<T> {
    for (const iterable of iterables) {
        for (const element of iterable) {
            yield element;
        }
    }
}

export function prepend<T>(first: Iterable<T>): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => concat([first, iterable]);
}

export function append<T>(second: Iterable<T>): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => concat([iterable, second]);
}

export function* concatMap<T, U>(
    iterable: Iterable<T>,
    f: (element: T) => Iterable<U>
): Iterable<U> {
    for (const element of iterable) {
        for (const newElement of f(element)) {
            yield newElement;
        }
    }
}

export function concatMapFn<T, U>(
    f: (element: T) => Iterable<U>
): (iterable: Iterable<T>) => Iterable<U> {
    return iterable => concatMap(iterable, f);
}

export function* scan<T, U>(
    iterable: Iterable<T>,
    f: (accumulator: U, element: T, index: number) => U,
    initial: U
): Iterable<U> {
    let a = initial;
    let i = 0;
    for (const element of iterable) {
        yield (a = f(a, element, i++));
    }
}

export function scanFn<T, U>(
    f: (accumulator: U, element: T, index: number) => U,
    initial: U
): (iterable: Iterable<T>) => Iterable<U> {
    return iterable => scan(iterable, f, initial);
}

export function* scan1<T>(
    iterable: Iterable<T>,
    f: (accumulator: T, element: T, index: number) => T
): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    let element = iterator.next();

    if (element.done === true) {
        return;
    }

    let accumulator = element.value;
    yield accumulator;
    let i = 1;
    element = iterator.next();
    while (element.done !== true) {
        yield (accumulator = f(accumulator, element.value, i++));
        element = iterator.next();
    }
}

export function scan1Fn<T>(
    f: (accumulator: T, element: T, index: number) => T
): (iterable: Iterable<T>) => Iterable<T> {
    return iterable => scan1(iterable, f);
}

export function* pairwise<T>(iterable: Iterable<T>): Iterable<readonly [T, T]> {
    const iterator = iterable[Symbol.iterator]();
    let prev = iterator.next();

    if (prev.done === true) {
        return;
    }

    let element = iterator.next();
    while (element.done !== true) {
        yield [prev.value, element.value];
        prev = element;
        element = iterator.next();
    }
}

/** Splits the Iterable at the specified index.
 *
 * Returns a tuple where the first element is the first `index` elements of the
 * Iterable, and the second element is the remaining elements of the Iterable. */
export function split<T>(iterable: Iterable<T>, index: number): [Iterable<T>, Iterable<T>] {
    const iterator = iterable[Symbol.iterator]();
    const left: T[] = [];
    const right: T[] = [];

    function* internal(side: T[]): Iterable<T> {
        for (const element of side) {
            yield element;
        }
        let element = iterator.next();
        while (element.done !== true && left.length < index) {
            left.push(element.value);
            if (side === left) {
                yield element.value;
            }
            element = iterator.next();
        }
        if (element.done === true) {
            return;
        }
        right.push(element.value);
        if (side === left) {
            return;
        }
        yield element.value;
        element = iterator.next();
        while (element.done !== true) {
            right.push(element.value);
            yield element.value;
            element = iterator.next();
        }
    }

    return [internal(left), internal(right)];
}

/** Returns a function that splits an Iterable at the specified index.
 *
 * This is the curried form of {@link split}. */
export function splitFn<T>(index: number): (iterable: Iterable<T>) => [Iterable<T>, Iterable<T>] {
    return iterable => split(iterable, index);
}

export function partition<T, U extends T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => element is U
): [Iterable<U>, Iterable<Exclude<T, U>>];
export function partition<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): [Iterable<T>, Iterable<T>];
export function partition<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): [Iterable<T>, Iterable<T>] {
    const iterator = iterable[Symbol.iterator]();
    const left: T[] = [];
    const right: T[] = [];
    let i = 0;

    function* internal(side: T[]): Iterable<T> {
        for (const element of side) {
            yield element;
        }
        let element = iterator.next();
        while (element.done !== true) {
            const valueSide = predicate(element.value, i) ? left : right;
            valueSide.push(element.value);
            if (valueSide === side) {
                yield element.value;
            }
            element = iterator.next();
            ++i;
        }
    }

    return [internal(left), internal(right)];
}

export function partitionFn<T, U extends T>(
    predicate: (element: T, index: number) => element is U
): (iterable: Iterable<T>) => [Iterable<U>, Iterable<Exclude<T, U>>];
export function partitionFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => [Iterable<T>, Iterable<T>];
export function partitionFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => [Iterable<T>, Iterable<T>] {
    return iterable => partition(iterable, predicate);
}

export function partitionWhile<T, U extends T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => element is U
): [Iterable<U>, Iterable<T>];
export function partitionWhile<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): [Iterable<T>, Iterable<T>];
export function partitionWhile<T>(
    iterable: Iterable<T>,
    predicate: (element: T, index: number) => boolean
): [Iterable<T>, Iterable<T>] {
    const iterator = iterable[Symbol.iterator]();
    const left: T[] = [];
    const right: T[] = [];
    let i = 0;

    function* internal(side: T[]): Iterable<T> {
        for (const element of side) {
            yield element;
        }
        let element = iterator.next();
        while (right.length === 0 && element.done !== true) {
            const valueSide = predicate(element.value, i) ? left : right;
            valueSide.push(element.value);
            if (valueSide === side) {
                yield element.value;
            }
            if (valueSide === right && side === left) {
                return;
            }
            element = iterator.next();
            ++i;
        }
        while (element.done !== true) {
            right.push(element.value);
            yield element.value;
            element = iterator.next();
        }
    }

    return [internal(left), internal(right)];
}

export function partitionWhileFn<T, U extends T>(
    predicate: (element: T, index: number) => element is U
): (iterable: Iterable<T>) => [Iterable<U>, Iterable<T>];
export function partitionWhileFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => [Iterable<T>, Iterable<T>];
export function partitionWhileFn<T>(
    predicate: (element: T, index: number) => boolean
): (iterable: Iterable<T>) => [Iterable<T>, Iterable<T>] {
    return iterable => partitionWhile(iterable, predicate);
}

/** Takes two Iterables and returns an Iterable of corresponding pairs.
 *
 * If one of the supplied Iterables is shorter than the other, then the excess
 * elements of the longer Iterable will be discarded. */
export function* zip<T, U>(a: Iterable<T>, b: Iterable<U>): Iterable<[T, U]> {
    const ai = a[Symbol.iterator]();
    const bi = b[Symbol.iterator]();

    let an = ai.next();
    let bn = bi.next();
    while (an.done !== true && bn.done !== true) {
        yield [an.value, bn.value];
        an = ai.next();
        bn = bi.next();
    }
}

/** Returns a function that combines the elements of `a` with the elements of
 * `b` and returns an Iterable of corresponding pairs.
 *
 * If one of the supplied Iterables is shorter than the other, then the excess
 * elements of the longer Iterable will be discarded.
 *
 * This is the curried variant of {@link zip}. */
export function zipFn<T, U>(b: Iterable<U>): (a: Iterable<T>) => Iterable<[T, U]> {
    return a => zip(a, b);
}

export function keyBy<TKey, TElement>(
    iterable: Iterable<TElement>,
    f: (element: TElement) => TKey
): Map<TKey, TElement[]> {
    const map = new Map<TKey, TElement[]>();
    for (const element of iterable) {
        const key = f(element);
        const elements = map.get(key) ?? [];
        if (!map.has(key)) {
            map.set(key, elements);
        }
        elements.push(element);
    }
    return map;
}

export function keyByFn<TKey, TElement>(
    f: (element: TElement) => TKey
): (iterable: Iterable<TElement>) => Map<TKey, TElement[]> {
    return iterable => keyBy(iterable, f);
}

export function keyFirstBy<TKey, TElement>(
    iterable: Iterable<TElement>,
    f: (element: TElement) => TKey
): Map<TKey, TElement> {
    const map = new Map<TKey, TElement>();
    for (const element of iterable) {
        const key = f(element);
        if (!map.has(key)) {
            map.set(key, element);
        }
    }
    return map;
}

export function keyFirstByFn<TKey, TElement>(
    f: (element: TElement) => TKey
): (iterable: Iterable<TElement>) => Map<TKey, TElement> {
    return iterable => keyFirstBy(iterable, f);
}

export function keyLastBy<TKey, TElement>(
    iterable: Iterable<TElement>,
    f: (element: TElement) => TKey
): Map<TKey, TElement> {
    const map = new Map<TKey, TElement>();
    for (const element of iterable) {
        const key = f(element);
        map.set(key, element);
    }
    return map;
}

export function keyLastByFn<TKey, TElement>(
    f: (element: TElement) => TKey
): (iterable: Iterable<TElement>) => Map<TKey, TElement> {
    return iterable => keyLastBy(iterable, f);
}

export function mapKeyBy<TKey, TElement, TNewElement>(
    iterable: Iterable<TElement>,
    f: (element: TElement, index: number) => [TKey, TNewElement]
): Map<TKey, TNewElement[]> {
    const map = new Map<TKey, TNewElement[]>();
    let i = 0;
    for (const element of iterable) {
        const [key, value] = f(element, i);
        const values = map.get(key) ?? [];
        if (!map.has(key)) {
            map.set(key, values);
        }
        values.push(value);
        ++i;
    }
    return map;
}

export function mapKeyByFn<TKey, TElement, TNewElement>(
    f: (element: TElement, index: number) => [TKey, TNewElement]
): (iterable: Iterable<TElement>) => Map<TKey, TNewElement[]> {
    return iterable => mapKeyBy(iterable, f);
}

export function mapKeyFirstBy<TKey, TElement, TNewElement>(
    iterable: Iterable<TElement>,
    f: (element: TElement, index: number) => [TKey, TNewElement]
): Map<TKey, TNewElement> {
    const map = new Map<TKey, TNewElement>();
    let i = 0;
    for (const element of iterable) {
        const [key, value] = f(element, i);
        if (!map.has(key)) {
            map.set(key, value);
        }
        ++i;
    }
    return map;
}

export function mapKeyFirstByFn<TKey, TElement, TNewElement>(
    f: (element: TElement, index: number) => [TKey, TNewElement]
): (iterable: Iterable<TElement>) => Map<TKey, TNewElement> {
    return iterable => mapKeyFirstBy(iterable, f);
}

export function mapKeyLastBy<TKey, TElement, TNewElement>(
    iterable: Iterable<TElement>,
    f: (element: TElement, index: number) => [TKey, TNewElement]
): Map<TKey, TNewElement> {
    const map = new Map<TKey, TNewElement>();
    let i = 0;
    for (const element of iterable) {
        const [key, value] = f(element, i);
        map.set(key, value);
        ++i;
    }
    return map;
}

export function mapKeyLastByFn<TKey, TElement, TNewElement>(
    f: (element: TElement, index: number) => [TKey, TNewElement]
): (iterable: Iterable<TElement>) => Map<TKey, TNewElement> {
    return iterable => mapKeyLastBy(iterable, f);
}
