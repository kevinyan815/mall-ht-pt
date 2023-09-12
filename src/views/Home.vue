<template>
  <div class="home">
    <header class="home-header wrap" :class="{'active' : state.headerScroll}">
      <router-link tag="i" to="./category"><i class="nbicon nbmenu2"></i></router-link>
      <div class="header-search">
        <span class="app-name">新蜂商城</span>
        <i class="iconfont icon-search"></i>
        <router-link tag="span" class="search-title" to="./product-list">山河无恙，人间皆安</router-link>
      </div>
      <router-link class="login" tag="span" to="./login" v-if="!state.isLogin">登录</router-link>
      <router-link class="login" tag="span" to="./user" v-else>
        <van-icon name="manager-o" />
  		</router-link>
    </header>
    <Swiper :list="state.swiperList"></Swiper>
    <div class="category-list">
      <div v-for="item in state.categoryList" v-bind:key="item.categoryId" @click="tips">
        <img :src="item.imgUrl">
        <span>{{item.name}}</span>
      </div>
    </div>
    <div class="good">
      <header class="good-header">新品上线</header>
      <div class="good-box">
        <div class="good-item" v-for="item in state.newGoodses" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="good">
      <header class="good-header">热门商品</header>
      <div class="good-box">
        <div class="good-item" v-for="item in state.hots" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="good" :style="{ paddingBottom: '100px'}">
      <header class="good-header">最新推荐</header>
      <div class="good-box">
        <div class="good-item" v-for="item in state.recommends" :key="item.goodsId" @click="goToDetail(item)">
          <img :src="$filters.prefix(item.goodsCoverImg)" alt="">
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, nextTick } from 'vue'
import { getLocal } from '@/common/js/utils'
import { getHome } from '@/service/home'
import { showLoadingToast, closeToast, showToast } from 'vant'
import Swiper from '@/components/Swiper.vue'
const state = reactive({
  isLogin: false, // 是否已登录
  swiperList: [], // 轮播图列表
  categoryList: [
    {
      name: '新蜂超市',
      imgUrl: '//s.weituibao.com/1583585285461/cs.png',
      categoryId: 100001
    }, {
      name: '新蜂服饰',
      imgUrl: '//s.weituibao.com/1583585285468/fs.png',
      categoryId: 100003
    }, {
      name: '全球购',
      imgUrl: '//s.weituibao.com/1583585285470/qq.png',
      categoryId: 100002
    }, {
      name: '新蜂生鲜',
      imgUrl: '//s.weituibao.com/1583585285472/sx.png',
      categoryId: 100004
    }, {
      name: '新蜂到家',
      imgUrl: '//s.weituibao.com/1583585285467/dj.png',
      categoryId: 100005
    }, {
      name: '充值缴费',
      imgUrl: '//s.weituibao.com/1583585285465/cz.png',
      categoryId: 100006
    }, {
      name: '9.9元拼',
      imgUrl: '//s.weituibao.com/1583585285469/pt.png',
      categoryId: 100007
    }, {
      name: '领劵',
      imgUrl: '//s.weituibao.com/1583585285468/juan.png',
      categoryId: 100008
    }, {
      name: '省钱',
      imgUrl: '//s.weituibao.com/1583585285471/sq.png',
      categoryId: 100009
    }, {
      name: '全部',
      imgUrl: '//s.weituibao.com/1583585285470/qb.png',
      categoryId: 100010
    }
  ],
  hots: [],
  newGoodses: [],
  recommends: [],
  headerScroll: false, // 滚动透明判断
})
onMounted(async () => {
  const token = getLocal('token')
  if (token) {
    state.isLogin = true
  }
  
  showLoadingToast({
    message: '加载中...',
    forbidClick: true
  });
  const { data } = await getHome()
  state.swiperList = data.carousels
  state.newGoodses = data.newGoodses
  state.hots = data.hotGoodses
  state.recommends = data.recommendGoodses
  closeToast()
})
nextTick(() => {
  document.body.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    scrollTop > 100 ? state.headerScroll = true : state.headerScroll = false
  })
})
</script>

<style lang="less" scoped>
@import '../common/style/mixin';
.home {
  .home-header {
    position: fixed;
    left: 0;
    top: 0;
    .wh(100%, 50px);
    .fj();
    line-height: 50px;
    padding: 0 15px;
    .boxSizing();
    font-size: 15px;
    color: #fff;
    z-index: 10000;
    .nbmenu2 {
      color: @primary;
    }
    &.active {
      background: @primary;
      .nbmenu2 {
        color: #fff;
      }
      .login {
        color: #fff;
      }
    }

    .header-search {
      display: flex;
      .wh(74%, 20px);
      line-height: 20px;
      margin: 10px 0;
      padding: 5px 0;
      color: #232326;
      background: rgba(255, 255, 255, .7);
      border-radius: 20px;
      .app-name {
        padding: 0 10px;
        color: @primary;
        font-size: 20px;
        font-weight: bold;
        border-right: 1px solid #666;
      }
      .icon-search {
        padding: 0 10px;
        font-size: 17px;
      }
      .search-title {
        font-size: 12px;
        color: #666;
        line-height: 21px;
      }
    }
    .login {
      color: @primary;
      line-height: 52px;
      .van-icon-manager-o {
        font-size: 20px;
        vertical-align: -3px;
      }
    }
  }
  .category-list {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 13px;
    div {
      display: flex;
      flex-direction: column;
      width: 20%;
      text-align: center;
      img {
        .wh(36px, 36px);
        margin: 13px auto 8px auto;
      }
    }
  }
  .good {
    .good-header {
      background: #f9f9f9;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: @primary;
      font-size: 16px;
      font-weight: 500;
    }
    .good-box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .good-item {
        box-sizing: border-box;
        width: 50%;
        border-bottom: 1PX solid #e9e9e9;
        padding: 10px 10px;
        img {
          display: block;
          width: 120px;
          margin: 0 auto;
        }
        .good-desc {
          text-align: center;
          font-size: 14px;
          padding: 10px 0;
          .title {
            color: #222333;
          }
          .price {
            color: @primary;
          }
        }
        &:nth-child(2n + 1) {
          border-right: 1PX solid #e9e9e9;
        }
      }
    }
  }
}
</style>