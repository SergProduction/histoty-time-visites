const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

// const TerserPlugin = require('terser-webpack-plugin')

const OUTPUT_DIR = './extension'

module.exports = (cliParams, webpackParams) => ({
  context: __dirname,
  entry: {
    background: path.join(__dirname, './src/background/background.ts'),
    contentscript: path.join(__dirname, './src/contentscript.ts'),
    popup: path.join(__dirname, './src/popup/popup.tsx'),
    app: path.join(__dirname, './src/app/app.tsx'),
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: ['node_modules'],
  },
  output: {
    path: path.join(__dirname, OUTPUT_DIR),
    filename: '[name].js',
    publicPath: "./",
  },
  // devtool: 'source-map',
  devtool: 'inline-source-map',
  optimization: {
    minimize: webpackParams.mode === 'production',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        test: /\.(ts|tsx)$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/i,
        loader: 'file-loader',
        options: {
          name: 'css/[name].[ext]',
        },
      },
      {
        test: /\.(svg)$/i,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        },
      },
      {
        test: /\.(eot|ttf|woff)$/i,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
        },
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": "{}", // костыль для @blueprintjs
    }),
    new HtmlWebpackPlugin({
      minify: false,
      title: 'History time visits',
      excludeChunks: ['background', 'contentscript', 'popup'],
      inject: 'body',
      template: path.join(__dirname, './src/app/app.ejs'),
      filename: 'app.html'
    }),
    new HtmlWebpackPlugin({
      minify: false,
      title: 'History time visits',
      excludeChunks: ['background', 'contentscript', 'app'],
      inject: 'body',
      template: path.join(__dirname, './src/popup/popup.ejs'),
      filename: 'popup.html'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, './src', "manifest.json"),
          to: path.join(__dirname, OUTPUT_DIR)
        },
        {
          from: path.join(__dirname, './src', "images"),
          to: path.join(__dirname, OUTPUT_DIR, "images")
        },
      ],
    }),
    /* new webpack.SourceMapDevToolPlugin({
      append: '\n//# sourceURL=[url]',
      filename: '[name][ext].map'
    }),
     */
  ]
})
