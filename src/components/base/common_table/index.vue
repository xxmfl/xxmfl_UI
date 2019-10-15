<template>
    <div class="base-table">
        <template :table="table">
            <el-row class="table-option">
                <template>
                    <slot name="searchSlot"></slot>
                </template>
                <div class="title left">{{table.title}}</div>
                <div class="right">
                    <slot name="addBtnSlot"></slot>
                    <el-button v-if="table.hasSelect" @click="chooseDelete" type="danger" class="ml-0">多行删除</el-button>
                    <span v-if="table.hashDynamicColumn" class="select-column">
            <el-select v-model="selectColumnData" multiple collapse-tags class="ml-0" placeholder="请选择">
              <el-option v-for="item in tableHeader" :label="item.label" :key="item.label"
                         :value="item.prop"></el-option>
            </el-select>
          </span>
                    <span v-if="table.hashDynamicColumn"><el-checkbox
                        @change="saveDynamicColumnData">保存到本地?</el-checkbox></span>
                </div>
            </el-row>
            <el-table
                v-loading="table.loading"
                :show-summary="table.hasShowSummary"
                :summary-method="table.getSummaries"
                ref="commonTable" :data="table.data"
                highlight-current-row
                tooltip-effect="dark" :border="table.border" style="width: 100%" :span-method="objectSpanMethod"
                :stripe="table.stripe" header-row-class-name="base-form-header"
                @selection-change="handleSelectionChange" @row-dblclick="rowDblclick">
                <el-table-column v-if="table.hasSelect" type="selection" width="55"></el-table-column>
                <el-table-column type="expand" v-if="table.hasExpand">
                    <template slot-scope="scope">
                        <slot v-if="table.expandSlot" name="expandSlot" :data="scope"></slot>
                        <el-form v-else label-position="left" inline class="table-expand">
                            <el-form-item :label="item.label" v-for="(item ,index) in table.expands" :key="index">
                                <span>{{ scope.row[item.prop] }}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <template v-if="table.hashDynamicColumn">
                    <template v-for="(item, index1) in tableColumn">
                        <el-table-column v-if="item.show !== false && item.show === 'template'" :label="item.label"
                                         :class-name="item.className ? item.className : ''" :key="index1"
                                         :width="item.width ? item.width : ''">
                            <template slot-scope="scope">
                                <slot :name="item" :data="scope"></slot>
                            </template>
                        </el-table-column>
                        <el-table-column v-else-if="item.show !== false && item.show !== 'template'" :label="item.label"
                                         :prop="item.prop" :class-name="item.className ? item.className : ''"
                                         :key="index1" :width="item.width ? item.width : ''" :sortable="item.sortable"
                                         show-overflow-tooltip>
                        </el-table-column>
                    </template>
                </template>

                <template v-else>
                    <template v-for="(item, index1) in table.column">
                        <el-table-column v-if="item.show !== false && item.show === 'template'" :label="item.label"
                                         :class-name="item.className ? item.className : ''" :key="index1"
                                         :width="item.width ? item.width : ''">
                            <template slot-scope="scope">
                                <slot :name="item.prop" :data="scope"></slot>
                            </template>
                        </el-table-column>
                        <el-table-column v-else-if="item.show !== false && item.show !== 'template'" :label="item.label"
                                         :prop="item.prop" :class-name="item.className ? item.className : ''"
                                         :key="index1" :width="item.width ? item.width : ''" :sortable="item.sortable"
                                         show-overflow-tooltip>
                        </el-table-column>
                    </template>
                </template>

                <el-table-column column-key="operation" :label="table.operation.label"
                                 :width="table.operation.width ? table.operation.width : ''"
                                 :class-name="table.operation.className" v-if="table.operation">
                    <template slot-scope="scope">
                        <el-button v-for="(item,index) in table.operation.data"
                                   :class="item.classname ? item.classname : ''" :key="index" :size="item.size"
                                   :type="item.type" @click="item.clickFun(scope.row)">
                            <i :class="item.icon" v-if="item.icon"></i>
                            {{ item.label }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row v-if="table.page">
                <div class="pagination" :class="[table.page.align ? table.page.align : 'align-left']">
                    <el-pagination
                        :current-page="table.page.pageNum"
                        :page-size="table.page.pageSize"
                        :total="table.page.totalPage"
                        @current-change="currentChange"
                        @size-change="sizeChange"
                        :layout="table.page.layout?table.page.layout:'total, sizes, prev, pager, next, jumper'"
                        background></el-pagination>
                </div>
            </el-row>
        </template>
    </div>
</template>
<script src="./common_table.js"></script>
<style src="./common_table.scss" scope lang="scss"></style>
