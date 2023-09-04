<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/profile">个人中心</router-link></li>
        <li><router-link to="/about">关于</router-link></li>
      </ul>
    </nav>
    <RouterView />
  </div>
</template>

<script setup>
  import { RouterView } from 'vue-router'
</script>