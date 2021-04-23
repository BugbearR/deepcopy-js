const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "umd"),
        filename: "deepcopy.js",
        library: "DeepCopy",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.ts(x*)?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.umd.json"
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    }
};
