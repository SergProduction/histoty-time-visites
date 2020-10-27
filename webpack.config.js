const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')



module.exports = {
  context: __dirname,
  entry: {
    background: path.join(__dirname, './src/background/index.ts'),
    contentscript: path.join(__dirname, './src/contentscript.ts'),
    app: path.join(__dirname, './src/app/index.tsx'),
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: ['node_modules'],
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    // publicPath: "/",
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: false,
      title: 'Histoty time visites',
      excludeChunks: ['background', 'contentscript'],
      inject: 'body',
      template: path.join(__dirname, './src/app/index.ejs'),
    }),
    new webpack.SourceMapDevToolPlugin({
      append: '\n//# sourceURL=[url]',
      filename: '[name][ext].map'
    })
  ]
}
