<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <cart-list></cart-list>
    <cart-buttom-bar></cart-buttom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar';
  import CartButtomBar from "./childComps/CartButtomBar";
  import CartList from "./childComps/CartList";
  import {mapGetters} from 'vuex'


  export default {
    name: "Cart",
    components:{
      NavBar,
      CartList,
      CartButtomBar
    },
    computed:{
      // ...mapGetters(['cartLength','cartList'])

      ...mapGetters({
        length:'cartLength',
        list:'cartList'

      })

    }
  }
</script>

<style scoped>
  .cart{
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .cart-list {
    position: absolute;
    top: 44px;
    bottom: 49px;
    width: 100%;
  }
</style>
