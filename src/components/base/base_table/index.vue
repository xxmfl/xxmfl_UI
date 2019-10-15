<template>
    <div class="base-table">
        <div style="text-align: right;margin: 10px 0;">

            <el-button type="primary" @click="insert">新增</el-button>


            <el-select v-model="colsValue" multiple placeholder="请选择" collapse-tags @change='seleckChange'
                       value-key="prop"
                       style="width: 200px;">
                <el-option
                    v-for="(item,index) in tableCols1"
                    :key="index"
                    :label="item.label"
                    :value="item">
                </el-option>
            </el-select>


        </div>
            <el-table
                :data="tableData"
                :border=basics.border
                :min-height=basics.height
                style="width: 100%"
                :stripe=basics.stripe
            >

                <el-table-column align="center" v-if="basics.selection" type="selection" width="55"></el-table-column>

                <el-table-column
                    v-for="(item,index) in tableCol"
                    :key=item.prop
                    :prop=item.prop
                    :label=item.label
                    :width=item.width
                    :align=item.align
                    :sortable=item.sortable
                >
                    <div v-if="item.child && item.child.length > 0 ">
                        <el-table-column
                            show-overflow-tooltip
                            :prop=item.child[0].prop
                            :label=item.child[0].label
                            :width=item.child[0].width
                            :align=item.child[0].align
                            :sortable=item.child[0].sortable
                        >
                            <template slot-scope="scope">
                                {{scope.row[item.prop]}}
                                <br/>
                                <div style="height:1px;border:none;border-top:1px solid #dde1e6;"></div>
                                {{scope.row[item.child[0].prop]}}
                            </template>
                        </el-table-column>
                    </div>


                </el-table-column>

                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-for="(item,index) in basics.operation"
                            :key="index"
                            @click='listenCall(item.method,scope.row,scope.$index,tableData)'
                            :type=item.type
                            size="small"
                        >{{item.name}}
                        </el-button>


                    </template>
                </el-table-column>


            </el-table>
            <!-- 以下为页脚翻页显示 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[30, 60, 90]"
                :page-size=this.pageSize
                class="rs-pagination"
                :current-page=this.pageIndex
                :total=this.total style="background:#fff">
            </el-pagination>
        </div>
</template>

<script>

    import {deepCopyRow} from "@/utils/validate";

    export default {
        props: [
            'tableConfig', 'tableDatas'
        ],
        data() {
            return {
                colsValue: [],
                tableCols1: [],
                tableConfigs: {},              //表格全部配置
                basics: {},                   //表格基础配置
                tableCol: [],                 //表格列的基础配置
                dropCol: [],
                changeValue: '',
                tableData: this.tableDatas,     //表格数据
                total: 0,
                pageSize: 30,
                pageIndex: 1,

                // selectValue: '',
                // currentPage: 1,//当前页面
                // data: this.table.data,//表格数据
                // batchdelete: '批量删除',
                // ifDelete: false,
                // SelectionVisible: false,
                // pagesize: this.table.allData.customerPreference.tableColumnRuler.pagination.everyPageCount,//每页显示数据
                // selectColumnData: this.table.allData.customerPreference.tableColumnRuler.cols,//动态列下拉框数据
                // selectOptions: this.table.allData.customerPreference.tableColumnRuler.cols,//下拉框Model
                // config: this.table.config,//表格可配置项
                // columns: this.table.allData.fields//表格所有列
            }
        },
        computed: {},
        watch: {
            colsValue(val) {
                this.tableCol = val
            },
            tableConfig: {
                handler: function (val) {
                    this.basics = val.basics
                    this.tableCol = val.tableCols
                    /**
                     * 需求: 初始化 列的默认值
                     * 作者: yinxg
                     * 时间: 2019-07-11
                     */
                    this.colsValue = this.tableCol
                    this.tableCols1 = deepCopyRow(val.tableCols) //列的下拉框内容不需要数据双向绑定，深拷贝
                },
                immediate: true,//关键
                deep: true
            }
        },

        mounted() {
            // this.columnDrop()
        },
        methods: {

            /**
             * 需求: 绑定按钮事件 row表格的行,index表格的索引,tableData表格的数据
             * 作者: yinxg
             * 时间: 2019-07-17
             */
            listenCall(val, row, index, tableData) {
                // console.log(val)
                this[val](row, index, tableData)
            },
            /**
             * 需求: 列的显示隐藏，保证显示的时候还在原来的位置。
             * 作者: yinxg
             * 时间: 2019-07-12
             */
            seleckChange(val) {
                let allNum = []
                this.tableCols1.map(item => {
                    allNum.push(item.prop)
                })
                val.sort((a, b) => {
                    return allNum.indexOf(a.prop) - allNum.indexOf(b.prop);
                })
            },
            /**
             * 需求: 新增
             * 作者: yinxg
             * 时间: 2019-07-15
             */
            insert() {
                this.$emit('insert')
            },
            /**
             * 需求: 编辑 row表格的行,index表格的索引,tableData表格的数据
             * 作者: yinxg
             * 时间: 2019-07-16
             */
            edit(row, index, tableData) {
                // console.log(tableData)
                this.$emit('edit', row, index, tableData)
            },
            /**
             * 需求: 删除
             * 作者: yinxg
             * 时间: 2019-07-16
             */
            delete(row, index, tableData) {
                this.$emit('deleted', index, tableData)
            },

            handleSizeChange(val) {
                console.log(val)
                this.pageSize = val;

            },
            handleCurrentChange(val) {
                console.log(val)
                this.pageIndex = val;

            },

        }
    }
</script>

<style lang="scss" scoped>
    .base-table {
        .el-pagination {
            position: absolute;
            bottom: 2.9em;
            z-index: 99;
            width: calc(100vw - 260px);
            background: #f3f3f4;
            height: 50px;
            padding: 10px 0px;
        }

        .filter-container {
            padding: 10px 0px;
            position: relative;

            .option-select {
                float: left;
            }
        }

        .select-column {
            width: 160px;
            display: inline-block;
            margin-right: .8em;
        }

        .el-button {
            padding: 8px 16px;
        }

        .el-table {
            .el-button {
                padding: 6px 0;
            }
        }

    }

</style>
