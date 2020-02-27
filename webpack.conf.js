import webpack from "webpack";
import path from "path";
const TerserPlugin = require('terser-webpack-plugin');

export default {
  module: {
    rules: [{
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '/[hash].[ext]',
          },
        }, ]
      },
      {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /node_modules/,
        query: {
          cacheDirectory: true
        },
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      "fetch": "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
    }),
  ],

  context: path.join(__dirname, "src"),
  entry: {
    app: ["./js/app"],
    cms: ["./js/cms"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
  },
  externals: [/^vendor\/.+\.js$/],
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: false,
        extractComments: true,
        cache: true,
        parallel: true,
      }),
    ],
    nodeEnv: 'production'
  },
  devtool: false,
};