const defaultTypeFuncMap = [
    ["[object Array]", (obj, deepCopy) => {
            const r = new Array(obj.length);
            obj.forEach((v, k) => {
                r[k] = deepCopy.copyImpl(v);
            });
            return r;
        }
    ],
    ["[object Map]", (obj, deepCopy) => {
            const r = new Map();
            obj.forEach((v, k) => {
                r.set(k, deepCopy.copyImpl(v));
            });
            return r;
        }
    ],
    ["[object Set]", (obj, deepCopy) => {
            return new Set(obj);
        }
    ],
    ["[object Date]", (obj, deepCopy) => {
            return new Date(obj);
        }
    ],
    ["[object RegExp]", (obj, deepCopy) => {
            return new RegExp(obj);
        }
    ]
];
export class DeepCopy {
    constructor(options) {
        this.memo = new Map();
        this.typeMap = new Map(defaultTypeFuncMap);
        this.instanceofMap = new Map();
        if (options) {
            if (options.typeMap) {
                options.typeMap.forEach((value) => {
                    this.typeMap.set(value[0], value[1]);
                });
            }
        }
    }
    copyImpl(obj) {
        if (obj === null) {
            return obj;
        }
        const objType = typeof obj;
        if (objType !== "object") {
            return obj;
        }
        const memoObj = this.memo.get(obj);
        if (memoObj) {
            return memoObj;
        }
        const objTypeStr = Object.prototype.toString.call(obj);
        const typeFunc = this.typeMap.get(objTypeStr);
        let r;
        if (typeFunc) {
            r = typeFunc(obj, this);
            this.memo.set(obj, r);
            return r;
        }
        const instanceofFunc = this.instanceofMap.get(obj);
        if (instanceofFunc) {
            r = instanceofFunc(obj, this);
            this.memo.set(obj, r);
            return r;
        }
        r = Object.create(Object.getPrototypeOf(obj));
        const propNames = Object.getOwnPropertyNames(obj);
        propNames.forEach((name) => {
            let desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc != null) {
                desc.value = this.copyImpl(desc.value);
                Object.defineProperty(r, name, desc);
            }
        });
        const symbolNames = Object.getOwnPropertySymbols(obj);
        symbolNames.forEach((name) => {
            let desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc != null) {
                desc.value = this.copyImpl(desc.value);
                Object.defineProperty(r, name, desc);
            }
        });
        this.memo.set(obj, r);
        return r;
    }
    copy(obj) {
        this.memo.clear();
        const r = this.copyImpl(obj);
        this.memo.clear();
        return r;
    }
}
