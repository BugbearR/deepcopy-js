export declare type DeepCopyCopyFunc = (obj: any, deepCopy: DeepCopy) => any;
export declare type DeepCopyOptions = {
    typeMap: [string, DeepCopyCopyFunc][];
    instanceofMap: [object, DeepCopyCopyFunc][];
};
export declare class DeepCopy {
    memo: Map<any, any>;
    typeMap: Map<string, DeepCopyCopyFunc>;
    instanceofMap: Map<object, DeepCopyCopyFunc>;
    constructor(options?: DeepCopyOptions);
    copyImpl(obj: any): any;
    copy(obj: any): any;
}
