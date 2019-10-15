<template>
    <div class="tag-nav">
        <scroll-bar ref="scrollBar">
            <router-link ref="tag" class="tag-nav-item" :class="isActive(item) ? 'cur' : ''" v-for="(item, index) in tagNavList"
            :to="item.path" :key="index">
                {{item.title}}
                <span class='el-icon-close' @click.prevent.stop="closeTheTag(item, index)"></span>
            </router-link>
        </scroll-bar>
    </div>
</template>

<script>
import ScrollBar from '@/components/layout/ScrollBar'

import { mapState } from 'vuex'

export default {
    components: {ScrollBar},
    data(){
        return {
            defaultPage: '',
            defaultPage1: ''
        }
    },
    computed: {
        ...mapState({
            navList: state => state.auth.navList
        }),
        tagNavList(){
            return this.$store.state.tagNav.openedPageList
        }
    },
    mounted(){
        // 首次加载时将默认页面加入缓存
        this.addTagNav()
        // console.log(this.navList)
        if(this.navList[0].children.length > 0){
            this.defaultPage = this.navList[0].children[0].path
        }else {
            this.defaultPage = this.navList[0].path
        }
    },
    watch: {
        $route(){
            this.addTagNav()
            this.scrollToCurTag()
        }
    },
    methods: {

        addTagNav(){
            // 如果需要缓存则必须使用组件自身的name，而不是router的name
            this.$store.commit("tagNav/addTagNav", {
                name: this.$router.getMatchedComponents()[1].name,
                path: this.$route.path,
                title: this.$route.meta.name
            })
        },
        isActive(item){
            return item.path === this.$route.path
        },
        closeTheTag(item, index){
            // 当关闭当前页面的Tag时，则自动加载前一个Tag所属的页面
            // 如果没有前一个Tag，则加载默认页面
            this.$store.commit("tagNav/removeTagNav", item)
            if(this.$route.path == item.path){
                if(index){
                    this.$router.push(this.tagNavList[index-1].path)
                } else {
                    this.$router.push(this.defaultPage)
                    console.log(this.$route.path)
                    if(this.$route.path == this.defaultPage){
                        this.addTagNav()
                    }
                }
            }
        },
        scrollToCurTag(){
            this.$nextTick(() =>{
                for (let item of this.$refs.tag) {
                    if (item.to === this.$route.path) {
                        this.$refs.scrollBar.scrollToCurTag(item.$el)
                        break
                    }
                }
            })
        }
    },
}

</script>

<style  lang="scss" scoped>
.tag-nav{
    height: 2.8em;
    line-height: 2.8em;
    background: #f3f3f4;
    .scroll-wrap{
        white-space: nowrap;
        overflow: hidden;
    }
    .tag-nav-item{
        display: inline-block;
        padding: 0px .8em;
        border: 1px solid #acb4d4;
        line-height: 20px;
        border-radius: 20px;
        color: #acb4d4;
        margin-right: .8em;
        &:nth-child(1){
            margin-left: .8em;
        }
        span{
            width: 1.2em;
            height: 1.2em;
            line-height: 1.2em;
            border-radius: 50%;
            text-align: center;
            vertical-align: middle;
            transition: all .3s ease;
            transform-origin: 100% 50%;
            &:before {
                display: inline-block;
            }
            &:hover {
                background: #acb4d4;
                color: white;
            }
        }
        &:hover,
        &.cur{
            background: #acb4d4;
            color: white;
        }
    }
    
}

</style>
