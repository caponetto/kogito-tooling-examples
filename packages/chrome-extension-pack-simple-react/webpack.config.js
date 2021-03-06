/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");
const packageJson = require("./package.json");
const pfWebpackUtils = require("../patternfly-base/webpackUtils");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    contentscript: "./src/contentscript.ts",
    background: "./src/background.ts",
    "envelope/index": "./src/envelope/index.ts"
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js"
  },
  externals: {},
  plugins: [
    new CopyPlugin([
      { from: "./static/manifest.json" },
      { from: "./static/resources", to: "./resources" },
      { from: "./static/envelope", to: "./envelope" }
    ]),
    new ZipPlugin({
      filename: "kogito_tooling_examples_chrome_extension_simple_react_" + packageJson.version + ".zip",
      pathPrefix: "dist"
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: path.resolve("./tsconfig.json")
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      ...pfWebpackUtils.patternflyLoaders
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    modules: [path.resolve("../../node_modules"), path.resolve("./node_modules"), path.resolve("./src")]
  }
};
