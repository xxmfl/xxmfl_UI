<template>
    <div class="wrapper">
        <template>
            <header-bar @collapseNavBar="collapseNavBar" v-once></header-bar>
            <left-nav-bar :collapse="hashCollapse"></left-nav-bar>
        </template>
        <div class="sys-content">
            <tag-nav></tag-nav>
            <div class="content-main">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
            <footer-bar/>
        </div>
    </div>
</template>

<script>
    import header_bar from "@/components/layout/header_bar"
    import footer_bar from "@/components/layout/footer_bar"
    import tag_nav from "@/components/layout/tag_nav"
    import left_navbar from '@/components/layout/left_navbar'

    export default {
        components: {
            'header-bar': header_bar,
            'footer-bar': footer_bar,
            'tag-nav': tag_nav,
            'left-nav-bar': left_navbar
        },
        data() {
            return {
                hashCollapse: false,
            }
        },
        methods: {
            collapseNavBar() {
                this.hashCollapse = !this.hashCollapse;
            }
        },

    }
</script>
