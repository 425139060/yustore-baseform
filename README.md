# yustore-baseform
> 更新 package.json version
> npm run lib
> npm login 如果没有登录
> npm publish

[elementui 2.x form](https://element.eleme.cn/#/zh-CN/component/form)


### base-form
> 配置表单 cols

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|  ----  | ----  | ----  | ----  | ----  |
| label | 表单项标题 | String | -- | -- |
| type | 表单项类型 | String | div、input、h1、slot | -- |
| field | 表单项字段 formData 包含属性名 | Object | -- | -- |
| required | 表单项是否必填 | Boolean | -- | false |
| hidden | 表单项是否显影 | Boolean | -- | false |
| retentionData | 表单项隐藏时是否将数据保留 | -- | -- | -- |
| options | 表单项选择雷荣，如 select radio checkbox | Array[{label: '', value: ''}] | -- | -- |
| props | 表单项各种属性 | Object | -- | -- |
| on | 表单项原生事件绑定 | Object | -- | -- |
| readonly | 是否只读，显示文本 | Boolean | -- | -- |
| fieldAttrs | 绑定attrs | Object | -- | -- |


```javascript
<base-form
    ref="baseForm"
    :cols="cols"
    :form-data="detailData"
    label-width="130px"
>
    <el-form-item slot="idCardImage">
    </el-form-item>
</base-form>

cols() {
    return [
        {
            label: '员工基本信息',
            type: 'h1'
        },
        {
            label: '员工姓名',
            type: 'input',
            field: 'name',
            readonly: true,
            props: {
                width: 300
            }
        },
        {
            label: '员工性别',
            type: 'select',
            field: 'gender',
            options: [
                { label: '男', value: 1 },
                { label: '女', value: 2 }
            ],
            readonly: true
        },
        
        {
            label: '身份证照片',
            type: 'slot',
            field: 'idCardImage'
        }
    ]
}
```


### dialog form
> 弹框表单返回一个Promise

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|  ----  | ----  | ----  | ----  | ----  |
| dialogAttrs | 弹框属性 | Object | -- | -- |
| formData | 默认回显的表单数据 | Object | -- | -- |
| formAttrs | 表单属性 | Object | -- | -- |
| request | 可选 Fnction，表单验证通过后执行 | Function(formData) => Promise | -- | -- |
| cols | 表单配置项 base-form | Array | -- | -- |

```javascript
let cols = [
    {
        label: '操作原因',
        type: 'input',
        field: 'reason',
        props: {
            type: 'textarea',
            rows: 4,
            maxlength: 1000,
            showWordLimit: true,
            autosize: { minRows: 3, maxRows: 15 }
        },
        required: true
    }
]
await this.$optionsDialog({
    dialogAttrs: {
        title: `确认吗`
    },
    formAttrs: {
        labelWidth: '100px'
    },
    request: (formData) => {
        return api(formData)
    },
    cols
})
this.$message.success('提交成功')
```

参数	说明	类型	可选值	默认值