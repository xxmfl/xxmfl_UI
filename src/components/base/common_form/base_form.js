import icon_select from "@/components/base/icon_select"

export default {
  name: 'base_form',
  props: ['config','buttonGroup','formModel','form'],
  data() {
    return {
    }
  },
  mounted(){
    console.info('form----',this.formModel);
  }
  ,
  methods: {
    //格式化规则
    formatRule(item) {
        if(item==-1){
            return 1000
        }else{
            return item
        }
    },
    // selectedIcon(val){
    //   this.$emit('selectedIcon',val);
    //   console.info(val);
    // }
  },
  components: {
    'icon-select':icon_select
  }
}