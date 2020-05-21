import {ADD_COUNTER,ADD_TO_CART} from "./mutation-types";


export default {
  addCart(context,payload){
    // for (let item of state.cartList){
    //   if(item.iid === payload.iid){
    //     oldProduct = item
    //   }
    // }
    return new Promise((resolve, reject) => {
      let product = context.state.cartList.find(item => item.iid === payload.iid)
      if(product){
        // product.count += 1
        context.commit(ADD_COUNTER,product)
        resolve('当前商品数量+1')
      }else {
        payload.count = 1
        // state.cartList.push(payload)
        context.commit(ADD_TO_CART,payload)
        resolve('添加了新的商品')

      }
    })

  }
}
