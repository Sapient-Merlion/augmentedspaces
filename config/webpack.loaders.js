const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./site.config');

// Define common loader constants
const sourceMap = config.env !== 'production';
const pugTemplates = fs
  .readdirSync(path.resolve(__dirname, `../${config.paths.src}/templates/views`))
  .filter(list => list.endsWith('.pug') === true);
const svgIconList = fs
  .readdirSync(path.resolve(__dirname, `../${config.paths.src}/icons`))
  .filter(list => list.endsWith('.svg') === true);

console.log('>>>>>>>pug/svg icon: ', pugTemplates, svgIconList);

// HTML loaders
const html = {
  test: /\.pug$/,
  use: [
    'html-loader',
    {
      loader: 'pug-html-loader',
      options: {
        pretty: true,
        exports: false,
        debug: false,
        compileDebug: config.env !== 'production',
        cache: false,
        data: {
          require: require,
          templatelist: pugTemplates,
          iconlist: svgIconList
        },
        attrs: ['img:src', 'link:href']
      }
    }
  ]
};

//SVG Sprite loader
const svg = {
  test: /\.svg$/,
  include: /src\/icons\/.+\.svg$/,
  use: [
    {
      loader: 'svg-sprite-loader',
      options: {
        extract: true,
        spriteFilename: 'sprite.svg',
        publicPath: '/icons/'
      }
    },
    {
      loader: 'svgo-loader',
      options: {
        plugins: [
          { removeTitle: true },
          { removeMetadata: true },
          { removeDesc: true },
          { removeViewBox: true },
          { removeUselessDefs: true },
          { removeAttrs: { attrs: '(fill)' } }
        ]
      }
    }
  ]
};

// Javascript loaders
const js = {
  test: /\.js$/,
  include: /src\/icons\/.+\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader'
  }
};

// {
//   test: /\.m?js$/,
//   exclude: /node_modules/,
//   use: {
//     loader: 'babel-loader',
//     options: {
//       plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-syntax-dynamic-import']
//     }
//   }
// };

// Style loaders
const styleLoader = {
  loader: 'style-loader',
  options: {
    sourceMap
  }
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap
  }
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: [require('autoprefixer')()],
    sourceMap
  }
};

const css = {
  test: /\.css$/,
  use: [
    config.env === 'production' ? MiniCssExtractPlugin.loader : styleLoader,
    cssLoader,
    postcssLoader
  ]
};

const sass = {
  test: /\.s[c|a]ss$/,
  use: [
    config.env === 'production' ? MiniCssExtractPlugin.loader : styleLoader,
    cssLoader,
    postcssLoader,
    {
      loader: 'sass-loader',
      options: {
        sourceMap
      }
    }
  ]
};

// Image loaders
const imageLoader = {
  loader: 'image-webpack-loader',
  options: {
    bypassOnDebug: true,
    gifsicle: {
      interlaced: false
    },
    optipng: {
      optimizationLevel: 7
    },
    pngquant: {
      quality: '65-90',
      speed: 4
    },
    mozjpeg: {
      progressive: true
    }
  }
};

const images = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  exclude: /src\/(icons|fonts)\/.+\.svg$/,
  use: [
    'file-loader?name=images/[name].[ext]',
    config.env === 'production' ? imageLoader : null
  ].filter(Boolean)
};

// Font loaders
/* const fonts = {
  test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
  exclude: /src\/icons\/.+\.svg$/,
  use: [
    {
      loader: 'file-loader',
      query: {
        name: '[name].[ext]',
        outputPath: 'fonts/'
      }
    }
  ]
}; */

module.exports = [svg, html, js, css, sass, images];
