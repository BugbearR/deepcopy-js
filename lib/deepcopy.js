"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepCopy = void 0;
var defaultTypeFuncMap = [
    ["[object Array]", function (obj, deepCopy) {
            var r = new Array(obj.length);
            obj.forEach(function (v, k) {
                r[k] = deepCopy.copyImpl(v);
            });
            return r;
        }
    ],
    ["[object Map]", function (obj, deepCopy) {
            var r = new Map();
            obj.forEach(function (v, k) {
                r.set(k, deepCopy.copyImpl(v));
            });
            return r;
        }
    ],
    ["[object Set]", function (obj, deepCopy) {
            return new Set(obj);
        }
    ],
    ["[object Date]", function (obj, deepCopy) {
            return new Date(obj);
        }
    ],
    ["[object RegExp]", function (obj, deepCopy) {
            return new RegExp(obj);
        }
    ]
];
var DeepCopy = /** @class */ (function () {
    function DeepCopy(options) {
        var _this = this;
        this.memo = new Map();
        this.typeMap = new Map(defaultTypeFuncMap);
        this.instanceofMap = new Map();
        if (options) {
            if (options.typeMap) {
                options.typeMap.forEach(function (value) {
                    _this.typeMap.set(value[0], value[1]);
                });
            }
        }
    }
    DeepCopy.prototype.copyImpl = function (obj) {
        var _this = this;
        if (obj === null) {
            return obj;
        }
        var objType = typeof obj;
        if (objType !== "object") {
            return obj;
        }
        var memoObj = this.memo.get(obj);
        if (memoObj) {
            return memoObj;
        }
        var objTypeStr = Object.prototype.toString.call(obj);
        var typeFunc = this.typeMap.get(objTypeStr);
        var r;
        if (typeFunc) {
            r = typeFunc(obj, this);
            this.memo.set(obj, r);
            return r;
        }
        var instanceofFunc = this.instanceofMap.get(obj);
        if (instanceofFunc) {
            r = instanceofFunc(obj, this);
            this.memo.set(obj, r);
            return r;
        }
        r = Object.create(Object.getPrototypeOf(obj));
        var propNames = Object.getOwnPropertyNames(obj);
        propNames.forEach(function (name) {
            var desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc != null) {
                desc.value = _this.copyImpl(desc.value);
                Object.defineProperty(r, name, desc);
            }
        });
        var symbolNames = Object.getOwnPropertySymbols(obj);
        symbolNames.forEach(function (name) {
            var desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc != null) {
                desc.value = _this.copyImpl(desc.value);
                Object.defineProperty(r, name, desc);
            }
        });
        this.memo.set(obj, r);
        return r;
    };
    DeepCopy.prototype.copy = function (obj) {
        this.memo.clear();
        var r = this.copyImpl(obj);
        this.memo.clear();
        return r;
    };
    return DeepCopy;
}());
exports.DeepCopy = DeepCopy;
