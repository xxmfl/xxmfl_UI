<template>
    <el-submenu v-if="item.children && item.children.length" :index="navIndex">
        <!-- 创建父级菜单 -->
        <template slot="title"><i v-if="item.icon" :class="item.icon"></i><span slot="title">{{ item.name }}</span></template>
        <!-- 创建子菜单 -->
        <nav-bar-item v-for="(subItem,i) in item.children" :key="navIndex+'-'+i" :navIndex="navIndex+'-'+i" :item="subItem" ></nav-bar-item>
    </el-submenu>
    <el-menu-item v-else :index="item.path" :route="{path: item.path}"><i v-if="item.icon" class="hashIcon" :class="item.icon"></i><span slot="title">{{ item.name }}</span></el-menu-item>
</template>

<script>
export default {
  name: 'NavBarItem',
  props: ['item','navIndex']
}
</script>

