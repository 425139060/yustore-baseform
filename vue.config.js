const isProduction = process.env.VUE_APP_MODE === 'production'

const cdn = {
  // 忽略打包的第三方库
  /**
  * externals 对象属性解析：
  * '包名' : '在项目中引入的名字'
  * 以element-ui举例 我再main.js里是以
  * import ELEMENT from 'element-ui'
  * Vue.use(ELEMENT, { size: 'small' })
  * 这样引入的，所以我的externals的属性值应该是ELEMENT
  */
  externals: {
    vue: 'Vue',
    // vuex: 'Vuex',
    // 'vue-router': 'VueRouter',
    // axios: 'axios',
    'element-ui': 'ELEMENT',
    lodash: 'lodash'
  },
  js: [
    'https://cdn.jsdelivr.net/npm/vue',
    // 'https://unpkg.com/vue-router/dist/vue-router.js',
    // 'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
    // 'https://cdn.bootcdn.net/ajax/libs/axios/0.19.2/axios.min.js',
    'https://unpkg.com/element-ui@2.15.14/lib/index.js'
  ],
  css: [
    'https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css'
  ]
}



const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // chainWebpack: (config) => {
	// 	if (isProduction) {
	//       config.plugin('html').tap((args) => {
	//         args[0].cdn = cdn
	//         return args
	//       })
  //   	}
  //   	config.plugin('html').tap(args => { // 所有环境配置统一的title
	//         args[0].title = '外部联网协议配置系统'
	//         return args
  //     })
	// },

	// configureWebpack: config => {
	// 	config.externals = cdn.externals
	// }
})
