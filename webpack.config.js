const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const TerserPlugin = require('terser-webpack-plugin')



module.exports = {
  context: __dirname,
  entry: {
    background: path.join(__dirname, './src/background/index.ts'),
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
  optimization: {
    minimize: false,
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
      excludeChunks: ['background'],
      inject: 'body',
      template: path.join(__dirname, './src/app/index.ejs'),
    })
  ]
}
