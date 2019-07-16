"use strict";
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = "vue mobile template"; // page title
const port = 9018; // dev port
const externals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  vant: "vant",
  axios: "axios"
};
// cdn
const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: [
      "https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.4.4/polyfill.js"
    ]
  },
  // 生产环境
  build: {
    css: ["https://cdn.jsdelivr.net/npm/vant@beta/lib/index.css"],
    js: [
      "https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.4.4/polyfill.js",
      "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.6/vue-router.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.1/vuex.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js",
      "https://cdn.jsdelivr.net/npm/vant@beta/lib/vant.min.js"
    ]
  }
};
module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/" : "./", // 需要区分生产环境和开发环境，不然build会报错
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    open: true,
    host: "0.0.0.0", // 允许外部ip访问
    port: port, // 端口
    https: false, // 启用https
    overlay: {
      warnings: true,
      errors: true
    }, // 错误、警告在页面弹出
    proxy: {
      "/api": {
        target: "http://www.baidu.com/api",
        changeOrigin: true, // 允许websockets跨域
        // ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    } // 代理转发配置，用于调试环境
  },
  configureWebpack: config => {
    // 为生产环境修改配置...
    if (process.env.NODE_ENV === "production") {
      // externals里的模块不打包
      Object.assign(config, {
        name: name,
        externals: externals
      });
    }
    // 为开发环境修改配置...
    if (process.env.NODE_ENV === "development") {
      console.log("开发环境");
    }
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    // alias
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("views", resolve("src/views"))
      .set("components", resolve("src/components"));
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin("html").tap(args => {
      if (process.env.NODE_ENV === "production") {
        args[0].cdn = cdn.build;
      }
      if (process.env.NODE_ENV === "development") {
        args[0].cdn = cdn.dev;
      }
      return args;
    });

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", config =>
        config.devtool("cheap-source-map")
      );

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          // elementUI: {
          //   name: "chunk-elementUI", // split elementUI into a single package
          //   priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          //   test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          // },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
