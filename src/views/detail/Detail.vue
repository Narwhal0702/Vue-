<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>


</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  // import Toast from "components/common/toast/Toast";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "../../components/content/goods/GoodsList";
  // import GoodsListItem from "components/content/goods/GoodsListItem";

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
  import {debounce} from "common/utils";
  import {itemListenerMixin, backTopMixin} from "common/mixin";

  import {mapActions} from 'vuex'


  export default {
    name: "Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      // Toast
      // GoodsListItem
    },
    mixins: [itemListenerMixin,backTopMixin],
    data(){
      return{
        iid: null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    created: function () {
      this.iid = this.$route.params.iid

      getDetail(this.iid).then(res => {
        //轮播图数据
        const data = res.result
        this.topImages = res.result.itemInfo.topImages

        //获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        //电铺信息
        this.shop = new Shop(data.shopInfo)

        this.detailInfo = data.detailInfo;

        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }


      })

      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        // this.themeTopYs.push(Number.MAX_SAFE_INTEGER);

        //console.log(this.themeTopYs);
      }, 100)
    },
    methods:{
      ...mapActions(['addCart']),
      detailImageLoad(){
        // let refresh = debounce(this.$refs.scroll.refresh,100)
        this.newRefresh()
        this.$refs.scroll.refresh()

        this.getThemeTopY()
      },
      titleClick(index){
        // console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],300)
      },
      contentScroll(position){
        const positionY = -position.y

        let length = this.themeTopYs.length
        for(let i=0;i < length - 1;i++){
          if(this.currentIndex !== i && (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex

          }
          // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]){
          // };
          // if(this.currentIndex !== i && ((i < length - 1 && positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
          //   (i === length -1 && positionY > this.themeTopYs[i]))){
          //   this.currentIndex = i;
          //   console.log(i);
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
        }
        this.isShowBackTop = -(position.y) > 1000;

      },
      addToCart(){
        //1.获取购物车所需要的信息
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;

        //2.将商品添加到购物车内
        //console.log(product);
        //(1)
        //mutation的提交
        //this.$store.commit('addCart', product);
        //action的提交
        //this.$store.dispatch('addCart', product).then({
        //   console.log(res);
        // })

        //(2)
        this.addCart(product).then(res => {
          console.log(res);
          this.$toast.show(res, 2000);
        })

        // this.$store.dispatch('addCart',product).then(res => {
        //   console.log(res);
        // })


      },


    },
    mounted() {

    },

  destroyed() {
    this.$bus.$off('itemImgLoad',this.itemImgListener)

  }
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav{
    background-color: #fff;
    position: relative;
    z-index: 9;
  }
  .content{
    height: calc(100% - 48px - 49px);
  }
</style>
