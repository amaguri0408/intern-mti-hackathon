<template>
  <div class="ui secondary pointing green inverted massive menu" v-if="isMenuNeeded">
    <router-link active-class="active" class="item" exact to="/">ホーム</router-link>
    <router-link active-class="active" class="item" to="/group">グループ</router-link>
    <router-link active-class="active" class="item" to="/ranking">ランキング</router-link>
    <div class="right menu">
      <a @click="logout" class="item">ログアウト</a>
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