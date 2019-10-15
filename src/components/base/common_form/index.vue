<template>
  <div class="base-form">
    <template :form="form">
        <el-form :model="formModel" ref="currentModel" :class="config?config.className:''" :label-width="config?config.labelWidth:''" :inline="config?config.inline:false">
        <!-- label-position="left" -->
        <template v-for="(val, key, index) in form" v-if="val.isDisplay" >
        <!-- 文本输入框 -->
        <el-form-item :label="val.label" :key="index" :prop="key" :rules="[{ required:val.isNotNull?val.isNotNull:false, message: val.message, trigger: 'blur' }]" v-if="val.type=='input'" :style="{width:val.width}" >
            <el-input v-model="formModel[key]" :disabled="!val.isModify"  :placeholder="val.placeholder"></el-input>
        </el-form-item>

        <!-- 下拉选择框 -->
        <el-form-item :label="val.label" :key="index" :prop="key" :rules="[{ required:val.isNotNull?val.isNotNull:false, message: val.message, trigger: 'change' }]" v-else-if="val.type=='select'" :style="{width:val.width}" >
            <el-select v-model="formModel[key]" :disabled="val.disabled" :placeholder="val.placeholder" :multiple="val.hashMultiple">
              <el-option v-for="(itm,idx) in val.options" :label="itm.label" :value="itm.value" :key="idx"></el-option>
            </el-select>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item :label="val.label" :key="index" :prop="key" :rules="[{ required:val.isNotNull?val.isNotNull:false, message: val.message, trigger: 'change' }]" v-else-if="val.type=='cascader'" :style="{width:val.width}" >
            <el-cascader :options="val.options" v-model="formModel[key]"></el-cascader>
        </el-form-item>
        
        <!-- 图标选择器 -->
        <el-form-item :label="val.label" :key="index" :prop="key"  v-else-if="val.type=='iconSelect'" :style="{width:val.width}">
          <el-popover
            placement="left-start"
            width="540"
            trigger="click"
            popper-class="popper-class">
            <icon-select ref="icons" @selected="val.selectedIcon" />
            <el-input slot="reference" placeholder="请输入内容" readonly v-model="formModel[key]" style="cursor: pointer;">
            <template slot="prepend"><i class="fa" :class="['fa-' + formModel[key]]"></i></template>
            </el-input>
          </el-popover>
        </el-form-item>
        <!-- 日期输入框 -->
        <el-form-item :label="val.label" :key="index" :prop="key" :rules="[{ type: 'date', required:val.isNotNull?val.isNotNull:false, message: val.message, trigger: 'blur' }]" v-if="val.type=='date'" :style="{width:val.width}">
          <el-date-picker v-model="formModel[key]" type="date" :placeholder="val.placeholder">
            </el-date-picker>
        </el-form-item>

        <!-- 日期输入框 -->
        <el-form-item  :label="val.label" :key="index" :prop="key" :rules="[{ required:val.isNotNull?val.isNotNull:false, message: val.message, trigger: 'blur' }]" v-if="val.type=='daterange'" :style="{width:val.width}">
            <el-date-picker v-model="formModel[key]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>

        <!-- 数字输入框 -->
        <el-form-item :label="val.label" :key="index" :prop="key" :rules="[{ required:val.isNotNull?val.isNotNull:false, message: val.message},{ type: 'number', message: val.label+'必须为数字值'}]" v-if="val.type=='numPicker'" :style="{width:val.width}">
            <el-input v-model="formModel[key]" :disabled="!val.disabled" :placeholder="val.placeholder" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 文本域输入框 -->
        <el-form-item class="form-textarea" :label="val.label" :key="index" :prop="key" :rules="[{ required:val.isNotNull?val.isNotNull:false, message: val.message, trigger: 'blur' }]" v-if="val.type=='textarea'" :style="{width:val.width}" >
            <el-input type="textarea" v-model="formModel[key]" :disabled="val.disabled" :placeholder="val.placeholder"></el-input>
        </el-form-item>
        <!-- switch开关 -->
        <el-form-item :label="val.label" :key="index" :prop="key" :rules="[{ required:val.isNotNull?val.isNotNull:false, message: val.message, trigger: 'change' }]" v-else-if="val.type=='switch'" :style="{width:val.width}" >
            <el-switch  v-model="formModel[key]" :disabled="val.disabled" :placeholder="val.placeholder"></el-switch>
        </el-form-item>

        <!-- 多选框 -->
        <el-form-item :label="val.label" :key="index" :prop="key" :rules="[{ required:val.isNotNull?val.isNotNull:false, message: val.message, trigger: 'change' }]" v-else-if="val.type=='checkbox'" :style="{width:val.width}" >
            <el-checkbox-group v-model="formModel[key]" :placeholder="val.placeholder">
              <el-checkbox v-for="(ittm,iddx) in val.options" :label="ittm.label" :key="iddx" :name="ittm.value"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <!-- 单选框 -->
        <el-form-item :label="val.label" :key="index" :prop="key" :rules="[{ required:val.isNotNull?val.isNotNull:false, message: val.message, trigger: 'change' }]" v-else-if="val.type=='radio'" :style="{width:val.width}" >
            <el-radio-group v-model="formModel[key]" :placeholder="val.placeholder">
              <el-radio v-for="(ittm,iddx) in val.options" :label="ittm.label" :key="iddx" :name="ittm.value"></el-radio>
            </el-radio-group>
        </el-form-item>
        </template>
      </el-form>
      <div v-if="buttonGroup" class="form-btn">
        <template v-for="(item,index) in buttonGroup" v-if="!item.hashHide">
          <el-button v-if="item.hashValiable" :class="item.align=='left'?'left':''" :size="item.siez?item.siez:'medium'" :key="index" :icon="item.icon?item.icon:''" :type="item.type" @click="item.clickBtn($refs['currentModel'])">{{item.text}}</el-button>
          <el-button v-else :class="item.align=='left'?'left':''" :size="item.siez?item.siez:'medium'" :icon="item.icon?item.icon:''" :key="index" :type="item.type" @click="item.clickBtn">{{item.text}}</el-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script src="./base_form.js"></script>
<style src="./base_form.scss" scope lang="scss"></style>

