<template>
    <div class="create-order">
      <s-header :name="'生成订单'"></s-header>
      <div class="address-wrap" v-if="state.address">
        <div class="name" @click="goTo">
          <span>{{ state.address.userName }}</span>
          <span>{{ state.address.userPhone }}</span>
        </div>
        <div class="address">
            {{ state.address.provinceName }} {{ state.address.cityName }} {{ state.address.regionName }} {{ state.address.detailAddress }}
        </div>
        <van-icon class="arrow" name="arrow" />
      </div>
      <div class="address-wrap" v-else>
        <div class="name">
          <span>我是昵称</span>
          <span>15758394732</span>
        </div>
        <div class="address">
          无地址, 请去添加收获地址
        </div>
        <van-icon class="arrow" name="arrow" />
      </div>
      <div class="good">
        <div class="good-item" v-for="(item, index) in state.cartList" :key="index">
            <div class="good-img"><img :src="$filters.prefix(item.goodsCoverImg)" alt=""></div>
            <div class="good-desc">
            <div class="good-title">
                <span>{{ item.goodsName }}</span>
                <span>x{{ item.goodsCount }}</span>
            </div>
            <div class="good-btn">
                <div class="price">¥{{ item.sellingPrice }}</div>
            </div>
            </div>
        </div>
      </div>
      <div class="pay-wrap">
        <div class="price">
          <span>商品金额</span>
          <span>¥{{ total }}</span>
        </div>
        <van-button class="pay-btn" color="#1baeae" type="primary" block>生成订单</van-button>
      </div>
    </div>
</template>
  
<script setup>
  import { reactive, onMounted, computed } from 'vue'
  import sHeader from '@/components/SimpleHeader.vue'
  import { setLocal, getLocal } from '@/common/js/utils'
  import { getByCartItemIds } from '@/service/cart'
  import { showLoadingToast, closeToast, showSuccessToast } from 'vant'
  import { useRoute, useRouter } from 'vue-router'
  import { getDefaultAddress, getAddressDetail } from '@/service/address'
  const router = useRouter()

  const route = useRoute()
  const state = reactive({
    cartList: [], // 购物车列表
    address: {}, // 地址
  })

  onMounted(() => {
    init()
  })
  const init = async () => {
    showLoadingToast({ message: '加载中...', forbidClick: true })
    // 获取查询参数内的 id
    const {addressId, cartItemIds } = route.query
    // id 会本地存储，如果查询字符串 id 优先获取，若没有则获取本地存储的 ids
    const _cartItemIds = cartItemIds ? JSON.parse(cartItemIds) : JSON.parse(getLocal('cartItemIds'))
    setLocal('cartItemIds', JSON.stringify(_cartItemIds))
    const { data: list } = await getByCartItemIds({ cartItemIds: _cartItemIds.join(',') })
    // addressId 有的情况下，优先获取 addressId，否则获取默认地址接口
    const { data: address } = addressId ? await getAddressDetail(addressId) : await getDefaultAddress()
    if (!address) {
        // router.push({ path: '/address' })
        // return
    }
    state.cartList = list
    state.address = address
    // console.log(state)
    closeToast()
  }
  
  // 前往地址生成页
  const goTo = () => {
    router.push({ path: '/address', query: { cartItemIds: JSON.stringify(state.cartItemIds), from: 'create-order' }})
  }

  const total = computed(() => {
    let sum = 0
    state.cartList.forEach(item => {
      sum += item.goodsCount * item.sellingPrice
    })
    return sum
  })
</script>
  
<style lang="less" scoped>
@import '../common/style/mixin';
.create-order {
    background: #f9f9f9;
    .address-wrap {
        margin-bottom: 20px;
        background: #fff;
        position: relative;
        margin-top: 44px;
        font-size: 14px;
        padding: 15px;
        color: #222333;
        .name, .address {
            margin: 10px 0;
        }
        .arrow {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
        }
        &::before {
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            height: 2px;
            background: -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
            background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
            background-size: 80px;
            content: '';
        }
    }
    .good {
        margin-bottom: 120px;
    }
    .good-item {
        padding: 10px;
        background: #fff;
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
    .pay-wrap {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        padding: 10px 0;
        padding-bottom: 50px;
        border-top: 1px solid #e9e9e9;
        >div {
            display: flex;
            justify-content: space-between;
            padding: 0 5%;
            margin: 10px 0;
            font-size: 14px;
            span:nth-child(2) {
            color: red;
            font-size: 18px;
            }
        }
        .pay-btn {
            position: fixed;
            bottom: 7px;
            right: 0;
            left: 0;
            width: 90%;
            margin: 0 auto;
        }
    }
}
</style>