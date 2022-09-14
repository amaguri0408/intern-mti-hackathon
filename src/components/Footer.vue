<template>
  <div class="ui secondary pointing orange inverted labeled icon massive menu" v-if="isMenuNeeded">
    <router-link active-class="active" class="item" exact to="/">ホーム</router-link>
  </div>
</template>
<script>
  export default {
    name: 'Footer',
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