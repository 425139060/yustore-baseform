import OptionsDialog from './dialog.vue'

/**
 * 简单表单弹出框插件
 * @param {Array} cols 表单项
 * @param {Object} formData 表单数据
 * @param {Object} options.dialogAttrs - 弹窗属性 https://element.eleme.cn/#/zh-CN/component/form
 * @param {Object} options.formAttrs - 表单属性 https://element.eleme.cn/#/zh-CN/component/dialog
 * @param {boolean} options.load - 加载状态
 * @param {Function} options.request - 表单验证通过后请求
 * @returns Promise
 */
export default {
    install(Vue) {
        Vue.prototype.$optionsDialog = function (options) {
            return new Promise((resolve, reject) => {
                const OptionsDialogClass = Vue.extend(OptionsDialog)
                OptionsDialogClass.prototype.reject = () => {
                    reject()
                }
                OptionsDialogClass.prototype.resolve = (data) => {
                    resolve(data)
                }
                const instance = new OptionsDialogClass({
                    parent: this,
                    propsData: {
                        dialogAttrs: options.dialogAttrs,
                        formAttrs: options.formAttrs,
                        load: options.load,
                        request: options.request,
                    },
                })
                instance.$mount()
                document.body.appendChild(instance.$el)
                instance.visible(options.cols, options.formData)
            })
        }
    }
}
