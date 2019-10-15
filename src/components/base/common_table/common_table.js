export default {
    drag_tablename: 'base_table',
    props: {
        table: {
            type: Object,
            default() {
                return {
                    title: '',                    //表格标题
                    hasMergeRowOrColumn: false, // 是否合并单元格
                    loading: false,          // 加载中动画
                    stripe: false,           //是否是创建带斑马纹的表格
                    hasShowSummary: false,   // 是否显示表位合计行
                    border: false,           // 是否带有纵向边框，默认为false
                    hasSelect: false,        // 有无选中功能
                    hasExpand: false,        // 有无展开行功能
                    page: {
                        pageNum: 1,            //当前处于第几页，默认第一页
                        pageSize: 10,          //每页显示多少条
                        totalPage: 0,           //总数据条数
                        align: 'align-left'    //分页布局  默认居左  分为:align-left ,align-center ,align-right
                    },
                    column: {                 // 表头数据 —— className:列的class名
                        'prop': {
                            label: 'label',
                            prop: 'prop',
                            className: 'classname',
                            width: '80',
                            sortable: false,
                            show: true           // show有三种值：false隐藏当前列，true常规表格列，template自定义表格列
//          <template slot-scope="props" slot="example">
//                <a class="list-a" target="_blank" :href="'/#/bombscreen?mobile=' + props.obj.row.mobile">{{ props.obj.row.username }}</a>
//          </template>
                        }
                    }
                    ,
                    hashDynamicColumn: false,//是否动态处理列
                    defaultShowColumn: [],    //默认显示列
                    data: [],                // 表格数据 —— 如需添加行class，处理数据时则需要传入class名， class需为数组
                    operation: {             // 操作功能
                        label: '操作',                // 操作列的行首文字
                        width: '',                // 操作列的宽度
                        className: '',               // 操作列的class名
                        data: [                      // 操作列数据
                            {
                                label: '',                // 按钮文字
                                methods: '',         // 点击按钮后触发的父组件事件
                                size: 'mini',                // 按钮大小
                                type: 'primary',              //按钮类型
                                classname: 'show',            // 按钮的类名
                                icon: ''                       //按钮图标
                            }
                        ]
                    },
                    expandSlot: false,         //表格下拉是否嵌入组件
                    expands: [               // 展开行数据
                        {
                            label: 'label',
                            prop: 'prop'
                        }
                    ],
                    getSummaries(param) {               // 自定义表位合计行数据
                        // *** 此函数传入param参数
                        console.log(param);
                        // *** 最后返回一个数组，合计行会显示数组中的内容
                        return []
                    }
                }
            }
        }
    },
    data() {
        return {
            selectValue: [],
            tableHeader: this.table.column,
            selectColumnData: this.table.defaultShowColumn,
            tableColumn: this.table.column
        }
    },
    watch: {
        selectColumnData(valArr) {
            this.tableColumn = this.tableHeader.filter(i => valArr.indexOf(i.prop) >= 0)
            this.key = this.key + 1// 为了保证table 每次都会重渲
        }
    },
    mounted() {
        if (this.hashDynamicColumn) {
            this.tableColumn = this.tableHeader.filter(i => this.selectColumnData.indexOf(i.prop) >= 0)
        }
    },
    methods: {
        //列排序
        seleckChange(val) {
            let allNum = []
            for (var key in this.table.column) {
                allNum.push(key)
            }
            val.sort((a, b) => {
                return allNum.indexOf(a) - allNum.indexOf(b);
            })
        },
        currentChange(val) {
            this.$emit('currentChange', val)
        },
        sizeChange(val) {
            this.$emit('sizeChange', val)
        },
        handleSelectionChange(val) {
            this.selectValue = val;
            this.$emit('handleSelectionChange', val);
        },
        chooseDelete(val) {
            if (this.selectValue.length <= 0) {
                this.$message({
                    message: '请选择需要执行操作的行',
                    type: 'warning'
                });
                return;
            }
            this.$confirm('此操作将永久删除选中文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$emit('chooseDelete', this.selectValue)
            }).catch(() => {

            });
        },
        objectSpanMethod({row, column, rowIndex, columnIndex}) {
            if (!this.hasMergeRowOrColumn) {
                return
            } else {
                this.$emit('onMergeRowOrColumn', {row, column, rowIndex, columnIndex});
            }
        },
        // 点击某一单元格时触发的函数
        // *** 按下左键然后移动鼠标到其它列放开左键，会有报错 -- 优化：添加点击行参数，
        rowDblclick(row, column, event) {
            // const data = {
            //   row: row,
            //   event: event,
            //   column: column
            // };
            this.$refs.commonTable.setCurrentRow(row);
            this.$emit('rowDblclick', row);
            // this.table.data.

        },
        saveDynamicColumnData(val) {
            this.$emit('saveDynamicColumn', val, this.table.selectColumnData);
        }
    },
    components: {}
}
