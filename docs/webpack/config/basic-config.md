# Configuration Webpack

## Configuration de base

### webpack.config.js

```javascript
const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    mode: 'development',
    devtool: 'source-map'
};
```

## Loaders

### CSS et SASS

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};
```

### JavaScript avec Babel

```javascript
{
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        }
    }
}
```

### Images

```javascript
{
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource'
}
```

## Plugins

### HtmlWebpackPlugin

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Mon App',
            template: './src/index.html'
        })
    ]
};
```

### MiniCssExtractPlugin

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    }
};
```

## Dev Server

```javascript
module.exports = {
    devServer: {
        contentBase: './dist',
        port: 3000,
        hot: true,
        open: true
    }
};
```

## Optimisation

```javascript
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};
```
