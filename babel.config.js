module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        // 指定目标环境，可以是一个浏览器列表或一个node版本
        targets: "> 0.25%, not dead",
        // 是否模块化
        modules: false,
        // 指定需要转换的特性，设置为false则不进行任何转换
        spec: true,
        // 是否启用内联定义插件
        useBuiltIns: 'usage',
        // 是否对polyfill进行按需引入
        corejs: 3,
      },
    ]
  ]
}
