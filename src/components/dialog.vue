<template>
    <div class="page-wrap" v-if="dialogVisible">
        <el-dialog
            :visible.sync="dialogVisible"
            width="30%"
            :modal-append-to-body="false"
            @close="cancel"
            v-bind="dialogAttrs"
        >
            <base-form
                ref="baseForm"
                :cols="cols"
                :formData="formData"
                v-bind="formAttrs"
            ></base-form>
            <div slot="footer">
                <el-button :loading="loading" @click="cancel">取 消</el-button>
                <el-button :loading="loading" type="primary" @click="confirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { isFunction } from 'lodash'
export default {
    props: {
        formAttrs: {
            type: Object
        },
        dialogAttrs: {
            type: Object
        },
        load: {
            type: Boolean,
            default: false
        },
        request: {
            type: Function
        }
    },
    data() {
        return {
            dialogVisible: false,
            cols: [],
            formData: {},
            loading: false
        }
    },
    watch: {},
    computed: {},
    created() {},
    deactivated() {
        this.dialogVisible = false
    },
    destroyed() {
        document.body.removeChild(this.$el)
    },
    methods: {
        visible(cols, formData = {}) {
            this.cols = cols
            this.formData = formData
            this.dialogVisible = true
        },
        cancel() {
            this.reject()
            this.dialogVisible = false
        },
        async confirm() {
            await this.$nextTick()
            const valid = await this.$refs.baseForm.validate()
            if (!valid) return
            if (isFunction(this.request)) {
                this.loading = true
                this.request(this.formData)
                    .then(() => {
                        this.dialogVisible = false
                        this.resolve()
                    })
                    .catch(() => this.reject())
                    .finally(() => {
                        this.loading = false
                    })
                return
            }
            this.resolve(this.formData)
            this.dialogVisible = false
        }
    }
}
</script>

<style scoped lang="less"></style>
