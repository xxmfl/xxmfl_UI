<template>
    <div class="base-form">
        <el-form :model="addFormData" ref="addFormData" :inline="true" :label-width="labelWidth">
            <span v-for="(val, index) in formConfigs.formItems" :key="index">
                <!-- 文本输入框 -->
                <el-form-item
                    :label=val.label
                    :prop=val.prop
                    v-if="val.type=='text' && val.display"
                    :rules=val.rules>
                    <el-input v-model="addFormData[val.prop]" :disabled="val.disabled"
                              :placeholder="val.label"></el-input>
                </el-form-item>

                <!-- 日期输入框 -->
                <el-form-item :label=val.label :prop=val.prop v-if="val.type=='date' && val.display">
                    <el-date-picker
                        :disabled="val.disabled"
                        v-model="addFormData[val.prop]"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <!-- 电话，手机的输入框 -->
                 <el-form-item :label=val.label :prop=val.prop v-if="val.type=='tel' && val.display"
                               :rules="[{ required: true, validator: validPhone}]">
                    <el-input v-model="addFormData[val.prop]" :disabled="val.disabled"
                              :placeholder="val.label"></el-input>
                </el-form-item>

            </span>


        </el-form>

        <div class="bottomBtn">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="commit('addFormData')">确 定</el-button>
        </div>

    </div>
</template>

<script>
    import { validPhone } from "@/utils/rules";
    import { deepCopyRow } from "@/utils/validate";

    export default {
        name:'base_form',
        props: [
            'formConfig','formData'
        ],
        data() {
            return {
                validPhone:validPhone,
                addFormData:{},
                formConfigs:{},
                labelWidth:'100px'
            }
        },
        computed:{


        },
        watch: {
            formConfig:{
                handler:function(val) {
                    this.formConfigs = deepCopyRow(val) //列的下拉框内容不需要数据双向绑定，深拷贝
                },
                immediate:true,//关键
                deep:true
            },
            formData:{
                handler:function(val) {
                    this.addFormData = deepCopyRow(val) //列的下拉框内容不需要数据双向绑定，深拷贝
                },
                immediate:true,//关键
                deep:true
            }
        },
        created(){

        },
        mounted() {

        },
        methods: {

            cancel(){
                this.$emit('cancel')
            },
            /**
             * 需求: 表单验证,调用父组建commit方法
             * 作者: yinxg
             * 时间: 2019-07-17
             */

            commit(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        this.$emit('commit',this.addFormData)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .base-form{
        .el-form{
            /deep/ .el-form-item {
                margin-bottom: 18px;
            }
            /deep/ .el-input{
                width: 177px;
                .el-input__inner{
                    width: 100%;
                }
            }

        }
        .bottomBtn{
            margin-top: 40px ;
            text-align: right;
        }

    }

</style>
