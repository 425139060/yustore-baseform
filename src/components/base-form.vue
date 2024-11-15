<script>
import renderMap, { renderFormItem } from './help'
const renderDefault = (h, _vm) => {
    // console.log(_vm)
    return h(
        'el-form',
        {
            ref: 'Form',
            props: {
                'label-width': _vm.labelWidth,
                labelPosition: _vm.labelPosition,
                model: _vm.formData,
                inline: _vm.inline,
                'label-suffix': ':'
            }
        },
        [
            ..._vm.cols
                .filter(col => {
                    if (col.hidden && !col.retentionData) _vm.$set(_vm.formData, [col.field], null) // 表单隐藏时，将数据清空
                    return !col.hidden
                })
                .map(col => _vm.renderCell(h, col)),
            ...(_vm.$slots.default || [])
        ]
    )
}
// const renderPreviewDialog = (h, _vm) => {
//     return h(
//         'el-dialog',
//         {
//             props: {
//                 visible: _vm.previewDialog.show,
//                 title: '图片预览',
//                 appendToBody: true
//             },
//             on: {
//                 'update:visible': val => {
//                     _vm.previewDialog.show = val
//                 }
//             }
//         },
//         [
//             h(
//                 'img',
//                 {
//                     style: {
//                         width: '100%'
//                     },
//                     attrs: {
//                         src: _vm.previewDialog.imgSrc
//                     }
//                 }
//             )
//         ]
//     )
// }
const renderElImage = (h, _vm) => {
    return h(
        'el-image',
        {
            ref: 'elImageRef',
            attrs: {
                src: 'xxx'
            },
            style: {
                width: '0px',
                height: '0px',
                // opacity: 0,
            },
            props: {
                previewSrcList: _vm.previewDialog.urlList,
            }
        }
    )
}
export default {
    name: 'base-form',
    components: {},
    props: {
        /**
         * cols 表单字段
         * @param {Object[]} cols - 表单字段
         * @param {string} cols[].label - 表单项标题
         * @param {string} cols[].type - 表单项类型和 div、tip、h1
         * @param {string} cols[].field - 表单项字段
         * @param {string} cols[].slot - 表单项使用插槽
         * @param {boolean} cols[].required - 表单项是否必填
         * @param {boolean} cols[].hidden - 表单项是否显影
         * @param {boolean} cols[].retentionData - 表单项影藏时是否将数据保留
         * @param {Array} cols[].options - 表单项选择雷荣，如 select radio checkbox
         * @param {Object} cols[].props - 表单项各种属性
         * @param {Object} cols[].on - 表单项原生事件绑定
         */
        cols: {
            type: Array,
            default: () => []
        },
        formData: {
            type: Object,
            default: () => {}
        },
        labelWidth: {
            default: '150px',
            type: String
        },
        labelPosition: {
            default: 'right',
            type: String
        },
        itemTypeString: {
            default: false,
            type: Boolean
        },
        inline: {
            default: false,
            type: Boolean
        },
        grid: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            previewDialog: {
                imgSrc: '',
                urlList: [],
                initialIndex: 1,
            }
        }
    },
    computed: {},
    watch: {},
    render(h) {
        return h(
            'div',
            { class: 'baseForm' },
            [
                renderDefault(h, this),
                renderElImage(h, this),
            ]
        )
    },
    created() {},
    mounted() {},
    destroyed() {},
    methods: {
        renderCell(h, col) {
            if (this.itemTypeString) col.type = 'string'
            if (col.slot) {
                return h('div', col.attrs || {}, this.$slots[col.slot] || [])
            }
            const { type, field } = col
            const {
                formData,
                $scopedSlots: { [field]: slotsFun }
            } = this
            const { [type]: renderCellFun } = renderMap
            let cell = null,
                childs = []
            cell = slotsFun
                ? slotsFun({ col })
                : renderCellFun && renderCellFun(h, this, col, formData)
            childs.push(cell)
            if (['h1', 'collapse'].includes(type)) return cell
            return renderFormItem(h, this, col, childs, this.grid)
        },
        validate() {
            const validPromise = []
            this.$refs.Form.validate(valid => {
                validPromise.push(valid ? Promise.resolve(true) : Promise.reject(false))
            })
            return Promise.all(validPromise).catch(error => {
                const errorDom = this.$el.querySelector('.el-form-item.is-error')
                errorDom && errorDom.scrollIntoView({ behavior: 'smooth' })
                return error
            })
        },
        clearValidate(props = []) {
            const fields = props.length
                ? typeof props === 'string'
                    ? this.fields.filter(field => props === field.prop)
                    : this.fields.filter(field => props.indexOf(field.prop) > -1)
                : this.fields
            fields.forEach(field => {
                field.validateState = ''
                field.validateMessage = ''
                field.validateDisabled = false
            })
        },
        async resetFields() {
            await this.$nextTick()
            this.$refs.Form.resetFields()
        }
    }
}
</script>
<style>
.divider-title {
    border-left: 2px solid #0055ff;
    font-weight: bold;
    padding: 2px 10px;
    margin-bottom: 20px;
    background: #fafcff;
}
.hide-upload-limit .el-upload {
    display: none;
}
.el-form-item__content .is-readonly {
    padding: 7px 0;
    line-height: 1.4;
}
.el-form--label-top .el-form-item__label {
    padding-bottom: 0;
}
</style>
