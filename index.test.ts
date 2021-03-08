import test from "ava";
import {
    dropWhile,
    empty,
    excludeFirst,
    excludeNull,
    filter,
    filterFirst,
    first,
    initial,
    isIterable,
    last,
    map,
    remove,
    removeFirst,
    slice,
    tail,
    takeWhile,
    toArray
} from "./index";

function* generator(): Iterable<number> {
    yield 1;
    yield 2;
    yield 3;
}

function* emptyGenerator(): Iterable<never> {}

test("isIterable", t => {
    t.false(isIterable(undefined));
    t.false(isIterable(null));
    t.false(isIterable(false));
    t.false(isIterable(123));
    t.false(isIterable("hello"));
    t.false(isIterable({a: 1, b: 2}));
    t.true(isIterable([1, 2, 3]));
    t.true(isIterable(generator()));
});

test("first", t => {
    t.is(1, first(generator()));
});

test("tail", t => {
    t.deepEqual([2, 3, 4], toArray(tail([1, 2, 3, 4])));
    t.deepEqual([2, 3], toArray(tail(generator())));
});

test("initial", t => {
    t.deepEqual([1, 2, 3], toArray(initial([1, 2, 3, 4])));
    t.deepEqual([1, 2], toArray(initial(generator())));
});

test("last", t => {
    t.is(null, last([]));
    t.is(3, last(generator()));
    t.is(4, last([1, 2, 3, 4]));
});

test("empty", t => {
    t.true(empty([]));
    t.true(empty(emptyGenerator()));
    t.false(empty([1, 2, 3, 4]));
    t.false(empty(generator()));
});

test("slice", t => {
    t.deepEqual([2, 3, 4], toArray(slice([1, 2, 3, 4], 1)));
    t.deepEqual([2, 3, 4], toArray(slice([1, 2, 3, 4, 5], 1, 4)));
    t.deepEqual([3], toArray(slice(generator(), 2)));
    t.deepEqual([1, 2], toArray(slice(generator(), 0, 2)));
    t.deepEqual([], toArray(slice(emptyGenerator(), 3, 5)));
});

test("takeWhile", t => {
    t.deepEqual([1, 2, 3], toArray(takeWhile([1, 2, 3, 4, 3, 2, 1], e => e < 4)));
    t.deepEqual([1, 2], toArray(takeWhile(generator(), (_, i) => i < 2)));
});

test("dropWhile", t => {
    t.deepEqual([4, 3, 2, 1], toArray(dropWhile([1, 2, 3, 4, 3, 2, 1], e => e < 4)));
    t.deepEqual([3], toArray(dropWhile(generator(), (_, i) => i < 2)));
});

test("map", t => {
    t.deepEqual([2, 3, 4], toArray(map(generator(), e => e + 1)));
    t.deepEqual([1, 20, 3], toArray(map(generator(), (e, i) => (i === 1 ? e * 10 : e))));
});

test("filter", t => {
    t.deepEqual([1, 3], toArray(filter(generator(), e => e % 2 === 1)));
    t.deepEqual([1, 2, 5], toArray(filter([1, 3, 2, 4, 5], (_, i) => i % 2 === 0)));
});

test("filterFirst", t => {
    t.deepEqual([1, 2, 4, 3, 2, 1], toArray(filterFirst([1, 2, 3, 4, 3, 2, 1], e => e < 3)));
});

test("excludeNull", t => {
    t.deepEqual(
        [1, 2, 3, 4, 3, 2, 1],
        toArray(excludeNull([1, 2, null, 3, 4, undefined, 3, 2, 1]))
    );
});

test("excludeFirst", t => {
    t.deepEqual([1, 2, 4, 3, 2, 1], toArray(excludeFirst([1, 2, 3, 4, 3, 2, 1], e => e > 2)));
});

test("remove", t => {
    t.deepEqual([1, 3, 4, 3, 1], toArray(remove([1, 2, 3, 4, 3, 2, 1], 2)));
});

test("removeFirst", t => {
    t.deepEqual([1, 3, 4, 3, 2, 1], toArray(removeFirst([1, 2, 3, 4, 3, 2, 1], 2)));
});
