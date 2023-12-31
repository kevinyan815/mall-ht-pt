<template>
  <div class="cart-box">
    <s-header :name="'购物车'"></s-header>
    <div class="cart-body">
      <van-checkbox-group @change="groupChange" v-model="state.result" ref="checkboxGroup">
      <van-swipe-cell :right-width="50" v-for="(item, index) in state.list" :key="index">
        <div class="good-item">
          <van-checkbox :name="item.cartItemId" />
            <div class="good-img"><img :src="$filters.prefix(item.goodsCoverImg)" alt=""></div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{ item.goodsName }}</span>
                <span>x{{ item.goodsCount }}</span>
              </div>
              <div class="good-btn">
                <div class="price">¥{{ item.sellingPrice }}</div>
                <van-stepper
                  integer
                  :min="1"
                  :max="5"
                  :value="item.goodsCount"
                  :name="item.cartItemId"
                  async-change
                  @change="onChange"
                  />
              </div>
            </div>
        </div>
        <template #right>
          <van-button
            square
            icon="delete"
            type="danger"
            class="delete-button"
            @click="deleteGood(item.cartItemId)"
            />
        </template>
      </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <van-submit-bar
      v-if="state.list.length > 0"
      class="submit-all van-hairline--top"
      :price="total * 100"
      button-text="结算"
      button-type="primary"
      @submit="onSubmit"
      >
      <van-checkbox @click="allCheck" v-model:checked="state.checkAll">全选</van-checkbox>
    </van-submit-bar>
    <!--购物车空状态-->
    <div class="empty" v-if="!state.list.length">
      <img class="empty-cart" src="https://s.yezgea02.com/1604028375097/empty-car.png" alt="空购物车">
      <div class="title">购物车空空如也</div>
      <van-button round color="#1baeae" type="primary" @click="goTo" block>前往选购</van-button>
    </div>
  </div>
</template>

<script setup>
  import { reactive, onMounted, computed } from 'vue'
  import { showToast, showLoadingToast, closeToast, showFailToast } from 'vant'
  import sHeader from '@/components/SimpleHeader.vue'
  import { getCart, deleteCartItem, modifyCart } from '@/service/cart'
  import { useCartStore } from '@/stores/cart'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const cart = useCartStore()

  const state = reactive({
    list: [], // 购物车商品列表
    result: [], // 选中的购物车商品 id 数组
  })
  onMounted(() => {
    init()
  })
  const init = async () => {
    showLoadingToast({ message: '加载中...', forbidClick: true });
    const { data } = await getCart({ pageNumber: 1 })
    state.list = data
    state.result = data.map(item => item.cartItemId)
    closeToast()
  }

  const deleteGood = async (id) => {
    const { data } = await deleteCartItem(id)
    cart.updateCart()
    init()
  }
  const onChange = async (value, detail) => {
    if (value > 5) {
      showFailToast('超出单个商品的最大购买数量')
      return
    }
    if (value < 1) {
      showFailToast('商品不得小于0')
      return
    }
    /**
   * 这里的操作是因为，后面修改购物车后，手动添加的计步器的数据，为了防止数据不对
   * 这边做一个拦截处理，如果点击的时候，购物车单项的 goodsCount 等于点击的计步器数字，
   * 那么就不再进行修改操作
  */
    if (state.list.find(item => item.cartItemId == detail.name)?.goodsCount == value) return
    showLoadingToast({ message: '修改中...', forbidClick: true });
    const params = {
      cartItemId: detail.name,
      goodsCount: value
    }
    await modifyCart(params)
    /**
   * 修改完成后，没有请求购物车列表，是因为闪烁的问题，
   * 这边手动给操作的购物车商品修改数据
  */
    state.list.forEach(item => {
      if (item.cartItemId == detail.name) {
        item.goodsCount = value
      }
    })
    closeToast()
  }

  // 多选变化是，整组的回调
  const groupChange = (result) => {
    if (result.length == state.list.length) {
      state.checkAll = true
    } else {
      state.checkAll = false
    }
    state.result = result
  }

  // 结算方法
  const onSubmit = async () => {
    if (state.result.length == 0) {
      showFailToast('请选择商品进行结算')
      return
    }
    const params = JSON.stringify(state.result)
    router.push({ path: '/create-order', query: { cartItemIds: params } }) // 占位
  }
  // 全选
  const allCheck = () => {
    if (!state.checkAll) {
      state.result = state.list.map(item => item.cartItemId)
    } else {
      state.result = []
    }
  }
  // 计算总价
  const total = computed(() => {
    let sum = 0
    let _list = state.list.filter(item => state.result.includes(item.cartItemId))
    // 每件商品，单价 * 数量 累加
    _list.forEach(item => {
      sum += item.goodsCount * item.sellingPrice
    })
    return sum
  })
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .cart-box {
    .cart-body {
      margin: 60px 0 100px 0;
      padding-left: 10px;
      .good-item {
        display: flex;
        .good-img {
          img {
            .wh(100px, 100px)
          }
        }
        .good-desc {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding: 20px;
          .good-title {
            display: flex;
            justify-content: space-between;
          }
          .good-btn {
            display: flex;
            justify-content: space-between;
            .price {
              font-size: 16px;
              color: red;
              line-height: 28px;
            }
            .van-icon-delete {
              font-size: 20px;
              margin-top: 4px;
            }
          }
        }
      }
      .delete-button {
      width: 50px;
      height: 100%;
      }
    }
  }

  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;
    .empty-cart {
      width: 150px;
      margin-bottom: 20px;
    }
    .van-icon-smile-o {
      font-size: 50px;
    }
    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
  .submit-all {
    margin-bottom: 64px;
    .van-checkbox {
      margin-left: 10px
    }
    .van-submit-bar__text {
      margin-right: 10px
    }
  }
</style>