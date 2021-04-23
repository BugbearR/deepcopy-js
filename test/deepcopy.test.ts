import * as DeepCopy from "../src/deepcopy";

test('Hello, world!', () => {
    const deepCopy = new DeepCopy.DeepCopy();
    expect(deepCopy.copy("Hello, world!")).toBe("Hello, world!");
});

test('Array empty', () => {
    const deepCopy = new DeepCopy.DeepCopy();
    var a: any[] = [];
    var b: any[] = [];
    expect(deepCopy.copy(a)).toStrictEqual(b);
});

test('Array 1 level', () => {
    const deepCopy = new DeepCopy.DeepCopy();
    var a: any[] = [1, "a", true];
    var b: any[] = [1, "a", true];
    expect(deepCopy.copy(a)).toStrictEqual(b);
});

test('Object empty', () => {
    const deepCopy = new DeepCopy.DeepCopy();
    var a: object = {};
    var b: object = {};
    expect(deepCopy.copy(a)).toStrictEqual(b);
});

test('Object 1 level', () => {
    const deepCopy = new DeepCopy.DeepCopy();
    var a: object = {hello: "world!", foo: 1, bar: true};
    var b: object = {hello: "world!", foo: 1, bar: true};
    expect(deepCopy.copy(a)).toStrictEqual(b);
});

test('Object 2 level', () => {
    const deepCopy = new DeepCopy.DeepCopy();
    var a: object = {x:{hello: "world!", foo: 1, bar: true}, y:{baz: false, nan: NaN, "undefined": undefined}};
    var b: object = {x:{hello: "world!", foo: 1, bar: true}, y:{baz: false, nan: NaN, "undefined": undefined}};
    expect(deepCopy.copy(a)).toStrictEqual(b);
});
