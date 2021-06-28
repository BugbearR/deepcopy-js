import * as DeepCopy from "../src/deepcopy";
import {test, expect} from "@jest/globals";

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

test('Object reference', () => {
    const deepCopy = new DeepCopy.DeepCopy();
    var a: any = {x:{hello: "world!", foo: 1, bar: true}, y:{baz: false, nan: NaN, "undefined": undefined}};
    a["x"]["yref"] = a["y"];
    // console.log(JSON.stringify(a["y"]));
    // console.log(JSON.stringify(a["x"]["yref"]));
    expect(a["x"]["yref"]).toStrictEqual(a["y"]);
    expect(a["x"]["yref"] === a["y"]).toBeTruthy();
    var r: any = deepCopy.copy(a);
    expect(r["y"]).toStrictEqual(a["y"]);
    expect(r["x"]["yref"]).toStrictEqual(a["y"]);
    expect(r["x"]["yref"] === r["y"]).toBeTruthy();
    expect(r["x"]["hello"]).toStrictEqual(a["x"]["hello"]);
    expect(r["x"]["foo"]).toStrictEqual(a["x"]["foo"]);
    expect(r["x"]["bar"]).toStrictEqual(a["x"]["bar"]);
});

test('Object recursive', () => {
    const deepCopy = new DeepCopy.DeepCopy();
    var a: any = {x:{hello: "world!", foo: 1, bar: true}, y:{baz: false, nan: NaN, "undefined": undefined}};
    a["x"]["xref"] = a["x"];
    var r: any = deepCopy.copy(a);
    expect(r["y"]).toStrictEqual(a["y"]);
    expect(r["x"]["xref"] === r["x"]).toBeTruthy();
    expect(r["x"]["hello"]).toStrictEqual(a["x"]["hello"]);
    expect(r["x"]["foo"]).toStrictEqual(a["x"]["foo"]);
    expect(r["x"]["bar"]).toStrictEqual(a["x"]["bar"]);
});
