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
        <div class="w-table" :class="{'w-table_moving': dragState.dragging}">
            <el-table
                :data="tableData"
                :border=basics.border
                :min-height=basics.height
                style="width: 100%"
                :stripe=basics.stripe
                :cell-class-name="cellClassName"
                :header-cell-class-name="headerCellClassName"
            >

                <el-table-column align="center" v-if="basics.selection" type="selection" width="55"></el-table-column>

                <el-table-column
                    v-for="(item,index) in tableCol"
                    :key='index'
                    :prop=item.prop
                    :label=item.label
                    :width=item.width
                    :align=item.align
                    :sortable=item.sortable
                    :column-key="index.toString()"
                    :render-header="renderHeader"
                >

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
    </div>
</template>

<script>

    import {deepCopyRow} from "@/utils/validate";
    import Sortable from 'sortablejs'

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
                dragState: {
                    start: -9, // 起始元素的 index
                    end: -9, // 移动鼠标时所覆盖的元素 index
                    dragging: false, // 是否正在拖动
                    direction: undefined // 拖动方向
                },

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
            renderHeader(createElement, {column}) {
                return createElement(
                    'div', {
                        'class': ['thead-cell'],
                        on: {
                            mousedown: ($event) => {
                                this.handleMouseDown($event, column)
                            },
                            mousemove: ($event) => {
                                this.handleMouseMove($event, column)
                            }
                        }
                    }, [
                        // 添加 <a> 用于显示表头 label
                        createElement('a', column.label),
                        // 添加一个空标签用于显示拖动动画
                        createElement('span', {
                            'class': ['virtual']
                        })
                    ])

            },
            // 按下鼠标开始拖动
            handleMouseDown(e, column) {
                this.dragState.dragging = true
                this.dragState.start = parseInt(column.columnKey)
                // 给拖动时的虚拟容器添加宽高
                let table = document.getElementsByClassName('w-table')[0]
                let virtual = document.getElementsByClassName('virtual')
                for (let item of virtual) {
                    item.style.height = table.clientHeight - 1 + 'px'
                    item.style.width = item.parentElement.parentElement.parentElement.clientWidth + 'px'
                }
                document.addEventListener('mouseup', this.handleMouseUp);
            },

            // 鼠标放开结束拖动
            handleMouseUp() {
                this.dragColumn(this.dragState)
                // 初始化拖动状态
                this.dragState = {
                    start: -9,
                    end: -9,
                    dragging: false,
                    direction: undefined
                }
                document.removeEventListener('mouseup', this.handleMouseUp);
            },

            // 拖动中
            handleMouseMove(e, column) {
                if (this.dragState.dragging) {
                    let index = parseInt(column.columnKey) // 记录起始列
                    if (index - this.dragState.start !== 0) {
                        this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
                        this.dragState.end = parseInt(column.columnKey)
                    } else {
                        this.dragState.direction = undefined
                    }
                } else {
                    return false
                }
            },

            // 拖动易位
            dragColumn({start, end, direction}) {
                let tempData = []
                let left = direction === 'left'
                let min = left ? end : start - 1
                let max = left ? start + 1 : end
                for (let i = 0; i < this.tableCol.length; i++) {
                    if (i === end) {
                        tempData.push(this.tableCol[start])
                    } else if (i > min && i < max) {
                        tempData.push(this.tableCol[left ? i - 1 : i + 1])
                    } else {
                        tempData.push(this.tableCol[i])
                    }
                }
                this.tableCol = tempData
            },

            headerCellClassName({column, columnIndex}) {
                let active = columnIndex - 1 === this.dragState.end ? `darg_active_${this.dragState.direction}` : ''
                let start = columnIndex - 1 === this.dragState.start ? `darg_start` : ''
                return `${active} ${start}`
            },

            cellClassName({column, columnIndex}) {
                return (columnIndex - 1 === this.dragState.start ? `darg_start` : '')
            },


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


        .w-table {
            　/deep/ .darg_start {
                background-color: #f3f3f3;
            }

            /deep/ th {
                padding: 0;
                .virtual {
                    position: fixed;
                    display: block;
                    width: 0;
                    height: 0;
                    margin-left: -65px;
                    background: none;
                    border: none;
                }

                &.darg_active_left {
                    .virtual {
                        border-left: 2px dotted #666;
                        z-index: 99;
                    }
                }

                &.darg_active_right {
                    .virtual {
                        border-right: 2px dotted #666;
                        z-index: 99;
                    }
                }
            }

            /deep/ .thead-cell {
                padding: 0;
                display: inline-flex;
                flex-direction: column;
                align-items: left;
                cursor: pointer;
                overflow: initial;

                &:before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                }
            }

            &.w-table_moving {
                /deep/ th .thead-cell {
                    cursor: move !important;
                }

                /deep/ .el-table__fixed {
                    cursor: not-allowed;
                }
            }
        }


    }

</style>
