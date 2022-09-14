<template>
  <!--<div>-->
    <div class="ui secondary orange labeled icon inverted large pointing menu" v-if="isMenuNeeded">
    <router-link active-class="active" class="item" exact to="/">
      <i class="home icon"></i>
      ホーム
    </router-link>
    <router-link active-class="active" class="item" to="/group">
      <i class="user circle icon"></i>
      グループ
    </router-link>
    <router-link active-class="active" class="item" to="/ranking">
      <i class="trophy icon"></i>
      ランキング
    </router-link>
    <div class="right menu">
      <a @click="logout" class="item">
        <i class="external alternate icon"></i>
        ログアウト
      </a>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Menu',
    computed: {
      isMenuNeeded() {
        return this.$route.name !== 'Login';
      }
    },
    methods: {
      logout() {
        window.localStorage.clear();
        this.$router.push({name: "Login"});
      }
    },
  };
</script>
<style scoped>
  
</style>