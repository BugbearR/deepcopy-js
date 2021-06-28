export type DeepCopyCopyFunc = (obj: any, deepCopy: DeepCopy) => any;

export type DeepCopyOptions =
{
    typeMap: [string, DeepCopyCopyFunc][],
    instanceofMap: [object, DeepCopyCopyFunc][]
};

const defaultTypeFuncMap: [string, DeepCopyCopyFunc][] = [
    [ "[object Array]",
        (obj: any, deepCopy: DeepCopy): any => {
            const r = new Array<any>(obj.length);
            obj.forEach(
                (v: any, k: number) =>
                {
                    r[k] = deepCopy.copyImpl(v);
                }
            );
            return r;
        }
    ],
    [ "[object Map]",
        (obj: any, deepCopy: DeepCopy): any => {
            const r = new Map<any, any>();
            obj.forEach(
                (v: any, k: any) =>
                {
                    r.set(k, deepCopy.copyImpl(v));
                }
            );
            return r;
        }
    ],
    [ "[object Set]",
        (obj: any, deepCopy: DeepCopy): any => {
            return new Set(obj);
        }
    ],
    [ "[object Date]",
        (obj: any, deepCopy: DeepCopy): any => {
            return new Date(obj);
        }
    ],
    [ "[object RegExp]",
        (obj: any, deepCopy: DeepCopy): any => {
            return new RegExp(obj);
        }
    ]
];

export class DeepCopy
{
    memo = new Map<any, any>();
    typeMap: Map<string, DeepCopyCopyFunc>;
    instanceofMap: Map<object, DeepCopyCopyFunc>;

    constructor(options?: DeepCopyOptions)
    {
        this.typeMap = new Map<string, DeepCopyCopyFunc>(defaultTypeFuncMap);
        this.instanceofMap = new Map<object, DeepCopyCopyFunc>();
        if (options)
        {
            if (options.typeMap) {
                options.typeMap.forEach((value) => {
                    this.typeMap.set(value[0], value[1]);
                });
            }
        }
    }

    copyImpl(obj: any): any
    {
        if (obj === null)
        {
            return obj;
        }

        const objType = typeof obj;
        if (objType !== "object")
        {
            return obj;
        }

        const memoObj = this.memo.get(obj);
        if (memoObj)
        {
            return memoObj;
        }

        const objTypeStr = Object.prototype.toString.call(obj);
        const typeFunc = this.typeMap.get(objTypeStr);

        let r: object;
        if (typeFunc)
        {
            r = typeFunc(obj, this);
            this.memo.set(obj, r);
            return r;
        }

        const instanceofFunc = this.instanceofMap.get(obj);
        if (instanceofFunc)
        {
            r = instanceofFunc(obj, this);
            this.memo.set(obj, r);
            return r;
        }

        r = Object.create(Object.getPrototypeOf(obj));
        this.memo.set(obj, r);
        const propNames = Object.getOwnPropertyNames(obj);
        propNames.forEach((name) =>
        {
            let desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc != null) {
                desc.value = this.copyImpl(desc.value);
                Object.defineProperty(r, name, desc);
            }
        });
        const symbolNames = Object.getOwnPropertySymbols(obj);
        symbolNames.forEach((name) =>
        {
            let desc = Object.getOwnPropertyDescriptor(obj, name);
            if (desc != null) {
                desc.value = this.copyImpl(desc.value);
                Object.defineProperty(r, name, desc);
            }
        });
        return r;
    }

    copy(obj: any): any
    {
        this.memo.clear();
        const r = this.copyImpl(obj);
        this.memo.clear();
        return r;
    }
}
