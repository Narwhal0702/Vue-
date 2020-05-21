import {debounce} from "./utils";

import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  data(){
    return{
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted(){

    this.newRefresh = debounce(this.$refs.scroll.refresh,200)

    this.itemImgListener = () => {
      this.newRefresh()
    }

    this.$bus.$on('itemImgLoad',this.itemImgListener)
  }
}

export const backTopMixin = {
  data(){
    return{
      isShowBackTop:false,
    }
  },
  components:{
    BackTop
  },
  methods:{
    backClick(position){
      this.$refs.scroll.scrollTo(0,0,500);
    },
  }
}
