import test from "ava";
import {first, initial, isIterable, last, tail, toArray} from "./index";

function* generator(): Iterable<number> {
    yield 1;
    yield 2;
    yield 3;
}

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
