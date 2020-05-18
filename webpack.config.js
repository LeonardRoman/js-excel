const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

// Среда разработки
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

// Наименование собранных файлов
const filename = ext => isDev ? `[name].${ext}` : `bundle.[hash].${ext}`

// Настройки сборки JS
const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }]
  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}

// Все настройки
module.exports = {
  // Папка файлов для разработки
  context: path.resolve(__dirname, 'src'),
  // Папка собранных файлов
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  devServer: {
    port: 4200,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : false,
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
        removeComments: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    })
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: isDev
            }
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      }
    ],
  },
}
