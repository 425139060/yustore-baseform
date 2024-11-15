import _ from 'lodash'
import { Message } from 'element-ui'
const dectEnum = []

function getLabelsByValues(data, values, field) {
    if (!Array.isArray(data)) {
        console.warn(`字段${field}绑定的 options 不是数组`)
        return ''
    }
    if (!Array.isArray(values)) {
        console.warn(`字段${field}绑定的 value 不是数组`)
        return ''
    }
    if (values.length === 0) {
        console.warn(`字段${field}绑定的 value 没有值`)
        return ''
    }

    function findLabel(items, currentValue) {
        for (let item of items) {
            if (item.value === currentValue) {
                return item
            }
            if (item.children && Array.isArray(item.children)) {
                let found = findLabel(item.children, currentValue)
                if (found) {
                    return found
                }
            }
        }
        return null
    }

    let labels = []
    let currentData = data
    for (let value of values) {
        let foundItem = findLabel(currentData, value)
        if (foundItem) {
            labels.push(foundItem.label)
            // 更新当前数据集为找到项的子项
            currentData = foundItem.children
        } else {
            // 如果找不到对应的值，则停止查找
            break
        }
    }

    return labels.join(' / ')
}

export function getPropByPath(obj, path) {
    let tempObj = obj
    path = path.replace(/\[(\w+)\]/g, '.$1')
    path = path.replace(/^\./, '')

    let keyArr = path.split('.')
    let i = 0

    for (let len = keyArr.length; i < len - 1; ++i) {
        let key = keyArr[i]
        if (key in tempObj) {
            tempObj = tempObj[key]
        } else {
            throw new Error('[warn]: please transfer a valid prop path to form item!')
        }
    }
    return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj[keyArr[i]]
    }
}

function getOns(_vm, col, data, props, tableObj) {
    const { on, field, type } = col
    const ons = {}
    let trigger = ''
    if (['upload'].includes(type)) {
        trigger = 'on-change'
    } else {
        trigger = 'input'
    }
    _.forIn(on, (func, key) => {
        ons[key] = function (...args) {
            func(...args, data)
        }
    })
    data &&
        (ons[trigger] = e => {
            const { o, k } = getPropByPath(data, field)
            _vm.$set(o, k, e)
            if (tableObj) {
                const { index, tableData } = tableObj
                tableData.splice(index, 1, o)
            }
            on && on[trigger] && on[trigger](e)
        })
    return ons
}

export const renderInput = (h, _vm, col, row, tableObj) => {
    const childs = []
    col.suffix && childs.push(h('span', { slot: 'suffix' }, col.suffix))
    col.prefix && childs.push(h('span', { slot: 'prefix' }, col.prefix))
    col.prepend && childs.push(h('span', { slot: 'prepend' }, col.prepend))
    col.append && childs.push(h('span', { slot: 'append' }, col.append))
    const props = col.props || {}
    const tagName = col.readonly ? 'div' : 'el-input' //  col.type === 'input' ? 'i-input' : inputNumber;
    const data = row || _vm.formData
    const attrs = {
        placeholder: '请输入'
    }
    col.readonly && childs.push(h('span', getPropByPath(data, col.field).v))
    //  原生属性
    const attrsKeys = ['maxlength', 'minlength', 'max', 'min', 'autofocus', 'placeholder']
    attrsKeys.forEach(key => {
        if (props[key] !== undefined) {
            attrs[key] = props[key]
        }
    })
    if (props.type === 'textarea' && !props.autosize) props.autosize = { minRows: 1, maxRows: 10 }
    return h(
        tagName,
        {
            on: getOns(_vm, col, data, props, tableObj),
            nativeOn: col.nativeOn,
            attrs,
            ref: col.field,
            class: {
                'is-readonly': col.readonly
            },
            props: {
                clearable: true,
                precision: col.precision,
                ...props,
                value: getPropByPath(data, col.field).v
            }
        },
        childs
    )
}

export const renderSelect = (h, _vm, col, row, tableObj) => {
    let options = []
    if (col.options) {
        options = col.options
    } else if (col.props && col.props.dicType) {
        options = dectEnum[col.props.dicType]
    }
    const value = (row || _vm.formData)[col.field]
    const emptyValue = [null, undefined, '']
    if (col.readonly) {
        let obj = _.find(options, ['value', value])
        return h(
            'div',
            {
                style: col.fieldStyle || col.style || {},
                class: {
                    'is-readonly': col.readonly
                }
            },
            obj ? obj.label : ''
        )
    }

    return h(
        'el-select',
        {
            on: getOns(_vm, col, row || _vm.formData, undefined, tableObj),
            nativeOn: col.nativeOn,
            ref: col.field,
            attrs: col.fieldAttrs || col.attrs,
            props: {
                clearable: true,
                ...(col.props || {}),
                value: value
            }
        },
        options.map(opt =>
            h('el-option', {
                props: {
                    ...opt,
                    label: opt.label,
                    value: emptyValue.includes(opt.value) ? opt.label : opt.value
                }
            })
        )
    )
}

export const renderCheckbox = (h, _vm, col, row, tableObj) => {
    const options = col.options || []
    const data = row || _vm.formData
    const value = getPropByPath(data, col.field).v
    return h(
        'el-checkbox-group',
        {
            on: getOns(_vm, col, row || _vm.formData, undefined, tableObj),
            nativeOn: col.nativeOn,
            ref: col.field,
            props: {
                ...(col.props || {}),
                value
            }
        },
        options.map(opt =>
            h(
                'el-checkbox',
                {
                    props: {
                        disabled: opt.disabled,
                        border: opt.border,
                        label: opt.value || opt.label
                    }
                },
                [opt.label]
            )
        )
    )
}

export const renderRadio = (h, _vm, col, row, tableObj) => {
    const options = col.options || []
    const data = row || _vm.formData
    if (col.props === undefined) col.props = {}
    const value = getPropByPath(data, col.field).v
    if (col.readonly) {
        let obj = _.find(options, ['value', value])
        return h(
            'div',
            {
                class: {
                    'is-readonly': col.readonly
                }
            },
            obj ? obj.label : ''
        )
    }
    return h(
        'el-radio-group',
        {
            ...(col.fieldAttrs || {}),
            on: getOns(_vm, col, row || _vm.formData, undefined, tableObj),
            nativeOn: col.nativeOn,
            ref: col.field,
            props: {
                ...col.props,
                value
            }
        },
        options.map(opt =>
            h(
                'el-radio',
                {
                    props: {
                        disabled: opt.disabled || col.props.disabled,
                        border: opt.border,
                        label: opt.value !== undefined ? opt.value : opt.label
                    }
                },
                [opt.label]
            )
        )
    )
}

// switch组件
export const renderSwitch = (h, _vm, col, row, tableObj) => {
    const data = row || _vm.formData
    const value = getPropByPath(data, col.field).v
    if (col.props === undefined) col.props = {}
    return h('el-switch', {
        on: getOns(_vm, col, row || _vm.formData, undefined, tableObj),
        nativeOn: col.nativeOn,
        ref: col.field,
        attrs: col.fieldAttrs || col.attrs,
        props: {
            ...(col.props || {}),
            value: value
        }
    })
}

export const renderDate = (h, _vm, col, row, tableObj) => {
    const data = row || _vm.formData
    const value = getPropByPath(data, col.field).v
    if (col.readonly) {
        return h(
            'div',
            {
                class: {
                    'is-readonly': col.readonly
                }
            },
            value
        )
    }
    return h(
        'el-date-picker',
        {
            on: getOns(_vm, col, row || _vm.formData, undefined, tableObj),
            nativeOn: col.nativeOn,
            ref: col.field,
            props: {
                clearable: true,
                placeholder: '请选择',
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyy-MM-dd',
                ...(col.props || {}),
                value: getPropByPath(data, col.field).v
            }
        },
        []
    )
}

export const renderUpload = (h, _vm, col, row, tableObj) => {
    const data = row || _vm.formData
    const { o, k } = getPropByPath(data, col.field)
    const children = []
    let initProps = Object.assign(
        {
            limit: 1,
            tip: ''
        },
        col.props || {}
    )
    col.props = initProps
    if (col.props && col.props.listType === 'text') {
        children.push(h('el-button', { props: { type: 'primary' } }, '点击上传'))
    } else {
        children.push(h('i', { class: 'el-icon-plus' }))
    }
    if (col.props && col.props.tip) {
        children.push(h('div', { slot: 'tip' }, col.props.tip))
    }
    return h(
        'el-upload',
        {
            on: getOns(_vm, col, row || _vm.formData, undefined, tableObj),
            nativeOn: {},
            ref: col.field,
            style: col.fieldAttrs ? col.fieldAttrs.style || {} : {},
            class: {
                'hide-upload-limit':
                    Boolean(getPropByPath(data, col.field).v) && col.props.limit === 1
            },
            props: {
                action: 'https://jsonplaceholder.typicode.com/posts/',
                listType: 'picture-card',
                beforeUpload: file => {
                    // console.log("🚀 ~ renderUpload ~ file:", file)
                    if (col.props.maxSize && file.size > col.props.maxSize) {
                        let sizeTip =
                            col.props.maxSize > 1024 * 1024 - 1
                                ? `${(col.props.maxSize / 1024 / 1024).toFixed(2)}M`
                                : `${(col.props.maxSize / 1024).toFixed(2)}kb`
                        Message.error(`文件大小不能超过 ${sizeTip}`)
                        return false
                    }
                    return true
                },
                onSuccess: response => {
                    const { code, message } = response
                    if (code !== 200) {
                        _vm.$set(o, k, '')
                        _vm.$refs[col.field].clearFiles()
                        if (message) {
                            Message.error(message)
                        }
                        return
                    }
                    if (col.props.limit === 1 && code === 200) {
                        _vm.$set(o, k, response.data.path)
                        return
                    }
                    _vm.$set(o, k, '')
                },
                onError: (err, file, fileList) => {
                    console.log('🚀 ~ renderUpload ~ err, file, fileList:', err, file, fileList)
                },
                onRemove: () => {
                    _vm.$set(o, k, '')
                },
                onPreview: file => {
                    _vm.$set(_vm.previewDialog, 'urlList', [file.url])
                    _vm.$nextTick(() => {
                        _vm.$refs.elImageRef.clickHandler()
                    })
                },
                onExceed: () => {
                    Message.error(`最多上传${col.props.limit}个文件`)
                },
                ...(col.props || {}),
                value: getPropByPath(data, col.field).v
            }
        },
        children
    )
}

const renderTip = (h, _vm, col) => {
    return h('div', { slot: 'label', class: 'inline-block' }, [
        h('span', {}, [col.label]),
        h(
            'formTip',
            {
                props: col.tip
            },
            []
        )
    ])
}
const renderImage = (h, _vm, col, row) => {
    const style = {
        width: '100px',
        height: '100px'
    }
    return h(
        'el-image',
        {
            ref: col.field,
            attrs: col.fieldAttrs || col.attrs,
            style: {
                ...style,
                ...(col.style || {})
            },
            props: {
                ...(col.props || {})
            }
        },
        []
    )
}

export const renderCascader = (h, _vm, col, row, tableObj) => {
    const options = col.options || []
    const value = (row || _vm.formData)[col.field]
    if (col.readonly) {
        return h(
            'div',
            {
                class: {
                    'is-readonly': col.readonly
                }
            },
            getLabelsByValues(options, value, col.field)
        )
    }
    return h(
        'el-cascader',
        {
            on: getOns(_vm, col, row || _vm.formData, undefined, tableObj),
            nativeOn: col.nativeOn,
            ref: col.field,
            attrs: col.fieldAttrs || col.attrs,
            props: {
                clearable: true,
                ...(col.props || {}),
                value: value,
                options
            }
        },
        []
    )
}

const rulesMsg = {
    input: '请输入',
    select: '请选择',
    cascader: '请选择',
    date: '请选择',
    upload: '请上传',
    radio: '请选择'
}
export const renderFormItem = (h, _vm, col, childs, grid) => {
    const labelWidth = col.label === undefined ? 0 : col.labelWidth
    const readonly =
        _.get(col, 'props.readonly') || col.isEdit === false || (!_vm.isEdit && !col.isEdit)
    const slotsFun = _vm.$scopedSlots[`header_${col.field}`]
    const slotsList = []
    slotsFun && slotsList.push(slotsFun({ col }))
    col.tip && col.tip.content && childs.push(renderTip(h, _vm, col))
    slotsFun && childs.push(h('div', { slot: 'label', class: 'inline-block' }, slotsList))
    if (!col.span) col.span = 25
    let rules = []
    if (col.props && col.props.rules) {
        rules = col.props.rules
    } else if (col.required) {
        rules.push({
            required: true,
            message: rulesMsg[col.type],
            trigger: col.type === 'input' ? 'blur' : 'change'
        })
    }
    const width = _.isNumber(col.span) ? col.span + '%' : col.span
    const style = grid
        ? {
              width,
              marginRight: 0,
              paddingRight: '10px'
          }
        : {}
    return h(
        'el-form-item',
        {
            style: {
                ...style
            },
            class: [
                col.class,
                'base-form-item',
                `label-${col.labelPosition || _vm.labelPosition}`,
                { 'not-allowed': readonly, [`form-item-${col.type}`]: col.type }
            ],
            props: {
                label: col.label,
                labelWidth: labelWidth,
                labelPosition: col.labelPosition,
                headerTip: col.headerTip || null,
                prop: col.field,
                // required: col.required, // 偶现字段验证显示英文结果 performanceMoney
                showMessage: col.showMessage,
                rules
            },
            key: col.field
        },
        childs
    )
}

export const renderH1 = (h, _vm, col) => {
    const slots = _vm.$scopedSlots || {}
    const children = []
    if (col.prefix) {
        children.push(h('i', { class: col.prefix }))
    }
    children.push(h('div', {}, col.label))
    if (col.suffix) {
        children.push(h('i', { class: col.suffix }))
    }
    if (col.buttons) {
        const bts = []
        col.buttons.forEach(bt => {
            bts.push(
                h(
                    'el-button',
                    {
                        props: bt
                    },
                    bt.text || ''
                )
            )
        })
        children.push(h('div', { class: 'form-item-butons' }, bts))
    }
    return h(
        'div',
        {
            class: ['divider-title', col.class],
            attrs: {
                id: col.field
            }
        },
        slots[col.field] ? slots[col.field]({ col }) : children
    )
}

const renderMap = {
    input: renderInput,
    select: renderSelect,
    checkbox: renderCheckbox,
    radio: renderRadio,
    date: renderDate,
    h1: renderH1,
    upload: renderUpload,
    cascader: renderCascader,
    switch: renderSwitch,
    image: renderImage
}

export default renderMap
