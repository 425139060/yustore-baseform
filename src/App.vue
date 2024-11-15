<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <base-form ref="baseForm" :cols="cols" :formData="formData" label-width="200px"></base-form>
    <el-button type="primary" size="default" @click="clickHandler">test</el-button>

  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      formData: {
        reason: '',
        reasonDetail: '',
      },
      cols: [
        {
          label: '退单原因',
          type: 'select',
          field: 'reason',
          required: true,
          options: [
            { label: '招商原因', value: '招商原因' },
            { label: '开发原因', value: '开发原因' },
            { label: '设计原因', value: '设计原因' },
            { label: '工程原因', value: '工程原因' },
            { label: '筹备原因', value: '筹备原因' },
            { label: '其它原因', value: '其它原因' }
          ]
        },
        {
          label: '退单详细描述',
          type: 'input',
          field: 'reasonDetail',
          required: true,
          props: {
            type: 'textarea'
          }
        },
      ]
    }
  },
  methods: {
    async clickHandler() {
      let cols = [
        {
          label: '选择开通方式',
          type: 'input',
          field: 'registerWalletType',
          required: true
        }
      ]
      await this.$optionsDialog({
        formData: {
          registerWalletType: ''
        },
        dialogAttrs: {
          title: `修改钱包开通方式`
        },
        formAttrs: {
          labelWidth: '120px'
        },
        request: formData => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {

              resolve()
            }, 1000)
          })
        },
        cols
      })
      this.$message.success('修改成功')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
