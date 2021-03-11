import test from "ava";
import {
    all,
    and,
    any,
    append,
    concat,
    concatMap,
    contains,
    dropWhile,
    empty,
    exclude,
    excludeFirst,
    excludeNull,
    filter,
    filterFirst,
    find,
    first,
    fold,
    fold1,
    initial,
    isIterable,
    keyBy,
    keyFirstBy,
    last,
    map,
    maximum,
    minimum,
    or,
    partition,
    partitionWhile,
    prepend,
    product,
    remove,
    removeFirst,
    scan,
    scan1,
    slice,
    sum,
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
    t.is(first(generator()), 1);
    t.is(first(emptyGenerator()), null);
});

test("tail", t => {
    t.deepEqual(toArray(tail([1, 2, 3, 4])), [2, 3, 4]);
    t.deepEqual(toArray(tail(generator())), [2, 3]);
    t.deepEqual(toArray(tail(emptyGenerator())), []);
});

test("initial", t => {
    t.deepEqual(toArray(initial([1, 2, 3, 4])), [1, 2, 3]);
    t.deepEqual(toArray(initial(generator())), [1, 2]);
    t.deepEqual(toArray(initial(emptyGenerator())), []);
});

test("last", t => {
    t.is(last([]), null);
    t.is(last(generator()), 3);
    t.is(last([1, 2, 3, 4]), 4);
});

test("empty", t => {
    t.true(empty([]));
    t.true(empty(emptyGenerator()));
    t.false(empty([1, 2, 3, 4]));
    t.false(empty(generator()));
});

test("slice", t => {
    t.deepEqual(toArray(slice([1, 2, 3, 4], 1)), [2, 3, 4]);
    t.deepEqual(toArray(slice([1, 2, 3, 4, 5], 1, 4)), [2, 3, 4]);
    t.deepEqual(toArray(slice(generator(), 2)), [3]);
    t.deepEqual(toArray(slice(generator(), 0, 2)), [1, 2]);
    t.deepEqual(toArray(slice(emptyGenerator(), 3, 5)), []);
});

test("takeWhile", t => {
    t.deepEqual(toArray(takeWhile([1, 2, 3, 4, 3, 2, 1], e => e < 4)), [1, 2, 3]);
    t.deepEqual(toArray(takeWhile(generator(), (_, i) => i < 2)), [1, 2]);
});

test("dropWhile", t => {
    t.deepEqual(toArray(dropWhile([1, 2, 3, 4, 3, 2, 1], e => e < 4)), [4, 3, 2, 1]);
    t.deepEqual(toArray(dropWhile(generator(), (_, i) => i < 2)), [3]);
});

test("map", t => {
    t.deepEqual(toArray(map(generator(), e => e + 1)), [2, 3, 4]);
    t.deepEqual(toArray(map(generator(), (e, i) => (i === 1 ? e * 10 : e))), [1, 20, 3]);
});

test("filter", t => {
    t.deepEqual(toArray(filter(generator(), e => e % 2 === 1)), [1, 3]);
    t.deepEqual(toArray(filter([1, 3, 2, 4, 5], (_, i) => i % 2 === 0)), [1, 2, 5]);
});

test("filterFirst", t => {
    t.deepEqual(toArray(filterFirst([1, 2, 3, 4, 3, 2, 1], e => e < 3)), [1, 2, 4, 3, 2, 1]);
});

test("exclude", t => {
    t.deepEqual(toArray(exclude([1, 2, 3, 4, 3, 2, 1], e => e < 3)), [3, 4, 3]);
});

test("excludeNull", t => {
    t.deepEqual(toArray(excludeNull([1, 2, null, 3, 4, undefined, 3, 2, 1])), [
        1,
        2,
        3,
        4,
        3,
        2,
        1
    ]);
});

test("excludeFirst", t => {
    t.deepEqual(toArray(excludeFirst([1, 2, 3, 4, 3, 2, 1], e => e > 2)), [1, 2, 4, 3, 2, 1]);
});

test("remove", t => {
    t.deepEqual(toArray(remove([1, 2, 3, 4, 3, 2, 1], 2)), [1, 3, 4, 3, 1]);
});

test("removeFirst", t => {
    t.deepEqual(toArray(removeFirst([1, 2, 3, 4, 3, 2, 1], 2)), [1, 3, 4, 3, 2, 1]);
});

test("fold", t => {
    t.is(
        fold(generator(), (a, e, i) => a + e * i, 0),
        8
    );
});

test("fold1", t => {
    t.is(
        fold1(generator(), (a, e, i) => a + e * i),
        9
    );
});

test("contains", t => {
    t.true(contains(generator(), 1));
    t.false(contains(generator(), 0));
});

test("find", t => {
    t.is(
        find([1, 2, 3, 4, 3, 2, 1], e => e > 2),
        3
    );
});

test("maximum", t => {
    t.is(maximum(generator()), 3);
    t.is(maximum([1, 2, 3, 4, 3, 2, 1]), 4);
    t.is(maximum(emptyGenerator()), null);
});

test("minimum", t => {
    t.is(minimum(generator()), 1);
    t.is(minimum([2, 3, 4, 1, 2, 3]), 1);
    t.is(minimum(emptyGenerator()), null);
});

test("sum", t => {
    t.is(sum(generator()), 6);
    t.is(sum(emptyGenerator()), 0);
});

test("product", t => {
    t.is(product(generator()), 6);
    t.is(product(emptyGenerator()), 1);
});

test("and", t => {
    t.true(and([true, true, true]));
    t.false(and([true, false, true]));
    t.true(and(emptyGenerator()));
});

test("or", t => {
    t.true(or([true, false, true]));
    t.false(or([false, false, false]));
    t.false(or([]));
});

test("any", t => {
    t.true(any(generator(), e => e > 2));
    t.false(any(generator(), e => e > 4));
});

test("all", t => {
    t.true(all(generator(), e => e < 4));
    t.false(all(generator(), e => e > 2));
});

test("concat", t => {
    t.deepEqual(toArray(concat([[1, 2], [], [3], [4, 5]])), [1, 2, 3, 4, 5]);
    t.deepEqual(toArray(concat([[], []])), []);
});

test("prepend", t => {
    t.deepEqual(toArray(prepend([1, 2, 3])([4, 5, 6])), [1, 2, 3, 4, 5, 6]);
    t.deepEqual(toArray(prepend<number>([])([4, 5, 6])), [4, 5, 6]);
    t.deepEqual(toArray(prepend([1, 2, 3])([])), [1, 2, 3]);
});

test("append", t => {
    t.deepEqual(toArray(append([4, 5, 6])([1, 2, 3])), [1, 2, 3, 4, 5, 6]);
    t.deepEqual(toArray(append<number>([])([1, 2, 3])), [1, 2, 3]);
    t.deepEqual(toArray(append([4, 5, 6])([])), [4, 5, 6]);
});

test("concatMap", t => {
    t.deepEqual(toArray(concatMap(["1,2,3", "4,5,6"], s => s.split(","))), [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
    ]);
});

test("scan", t => {
    t.deepEqual(toArray(scan(generator(), (a, e, i) => a + e * i, 0)), [0, 2, 8]);
});

test("scan1", t => {
    t.deepEqual(toArray(scan1(generator(), (a, e, i) => a + e * i)), [1, 3, 9]);
});

type Result<T> = Success<T> | Error;

interface Success<T> {
    type: "success";
    value: T;
}

interface Error {
    type: "error";
}

function isSuccess<T>(result: Result<T>): result is Success<T> {
    return result.type === "success";
}

test("partition", t => {
    t.deepEqual(
        toArray(
            map(
                partition([2, 1, 3, 4, 5, 6], e => e % 2 === 1),
                toArray
            )
        ),
        [
            [1, 3, 5],
            [2, 4, 6]
        ]
    );

    const partitions = partition([2, 1, 3, 4, 5, 6], e => e % 2 === 1);
    t.is(first(partitions[0]), 1);
    t.deepEqual(toArray(partitions[1]), [2, 4, 6]);

    t.deepEqual(
        toArray(
            map(
                partition(["abc", "def", "ghi"], (_: string, i: number) => i % 2 === 0),
                toArray
            )
        ),
        [["abc", "ghi"], ["def"]]
    );

    const results: Array<Result<string>> = [
        {type: "success", value: "hello"},
        {type: "error"},
        {type: "success", value: "goodbye"}
    ];

    const partitionedResults: [Iterable<Success<string>>, Iterable<Error>] = partition(
        results,
        isSuccess
    );

    t.deepEqual(toArray(partitionedResults[0]), [
        {type: "success", value: "hello"},
        {type: "success", value: "goodbye"}
    ]);
    t.deepEqual(toArray(partitionedResults[1]), [{type: "error"}]);
});

test("partitionWhile", t => {
    t.deepEqual(
        toArray(
            map(
                partitionWhile([1, 3, 2, 4, 5, 6], e => e % 2 === 1),
                toArray
            )
        ),
        [
            [1, 3],
            [2, 4, 5, 6]
        ]
    );

    const partitions = partitionWhile([1, 3, 2, 4, 5, 6], e => e % 2 === 1);
    t.is(first(partitions[0]), 1);
    t.deepEqual(toArray(partitions[1]), [2, 4, 5, 6]);

    t.deepEqual(
        toArray(
            map(
                partitionWhile(["abc", "def", "ghi"], (_: string, i: number) => i % 2 === 0),
                toArray
            )
        ),
        [["abc"], ["def", "ghi"]]
    );

    const results: Array<Result<string>> = [
        {type: "success", value: "hello"},
        {type: "error"},
        {type: "success", value: "goodbye"}
    ];

    const partitionedResults: [
        Iterable<Success<string>>,
        Iterable<Result<string>>
    ] = partitionWhile(results, isSuccess);

    t.deepEqual(toArray(partitionedResults[0]), [{type: "success", value: "hello"}]);
    t.deepEqual(toArray(partitionedResults[1]), [
        {type: "error"},
        {type: "success", value: "goodbye"}
    ]);
});

test("keyBy", t => {
    const map = keyBy([1, 3, 4, 2, 5, 6], e => (e % 2 === 0 ? "even" : "odd"));
    t.deepEqual(map.get("even"), [4, 2, 6]);
    t.deepEqual(map.get("odd"), [1, 3, 5]);
    t.deepEqual(toArray(map.keys()), ["odd", "even"]);
});

test("keyFirstBy", t => {
    const map = keyFirstBy([1, 3, 4, 2, 5, 6], e => (e % 2 === 0 ? "even" : "odd"));
    t.is(map.get("even"), 4);
    t.is(map.get("odd"), 1);
    t.deepEqual(toArray(map.keys()), ["odd", "even"]);
});
