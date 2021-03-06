const path = require('path')
const debug = process.env.NODE_ENV !== 'production'
// const VueConf = require('./src/assets/js/libs/vue_config_class')
// const vueConf = new VueConf(process.argv)

function resolve(dir) {
  return path.join(__dirname, dir);
}

const config = require('./config');

module.exports = {
  publicPath: './', // vueConf.baseUrl, // 根域上下文目录
  outputDir: 'dist', // 构建输出目录
  assetsDir: 'assets', // 静态资源目录 (js, css, img, fonts)
  lintOnSave: true, // 是否开启eslint保存检测，有效值：ture | false | 'error'
  runtimeCompiler: true, // 运行时版本是否需要编译
  transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  css: { // 配置高于chainWebpack中关于css loader的配置
    // modules: true, // 是否开启支持‘foo.module.css’样式
    // extract: true, // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
    sourceMap: false, // 是否在构建样式地图，false将提高构建速度
    loaderOptions: { // css预设器配置项
      sass: {
        data: ''// `@import "@/assets/scss/mixin.scss";`
      }
    }
  },
  configureWebpack: config => {
    config.externals = {
      'TWEEN': 'TWEEN'
      // 'gsap': 'gsap'
    };
  },
  chainWebpack: (config) => {
    // config.module
    //   .rule('js')
    //   .use('babel-loader')
    //   // .loader('babel-loader')
    //   .include
    //   // .add('./node_modules/element-ui/src/(utils/popper.js|utils/date.js)/')
    //   .add('/src/utils/popper.js')
    //   .end()

    config.resolve.alias
      .set("src", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("base", resolve("baseConfig"))
      .set("public", resolve("public"))
      .set("packages", resolve("packages"))
      .set("node_modules", resolve("node_modules"));
  },
  parallel: require('os').cpus().length > 1, // 构建时开启多进程处理babel编译
  pluginOptions: { // 第三方插件配置
  },
  pwa: { // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  },
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 7779,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'https://www.easy-mock.com/mock/5d69c9599da4252067f6c57f/example',
        ws: true,
        changOrigin: true
      }
    },
    before: app => { }
  }
}
