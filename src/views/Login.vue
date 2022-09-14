<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="submit">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="ID" v-model="user.userId">
            </div>
          </div>
          
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="text" placeholder="Password" v-model="user.password">
            </div>
          </div>
          
          <div v-if="!isLogin">
            <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" name="type" value="alone">
                <label>一人で始める</label>
              </div>
            </div>
            
            <div class="field" value="together">
              <div class="ui radio checkbox">
                <input type="radio" name="type">
                <label>友達と始める</label>
              </div>
            </div>
            
            <h2>グループ選択</h2>
        
            <div class="ui segment group">AAAAAAAAa</div>
            <div class="ui segment group">AAAAAAAAa</div>
            <div class="ui segment group">AAAAAAAAa</div>
            
        <!--<template v-for="(group) in groups">-->
        <!--    <div class="ui segment">-->
        <!--      <div class="content">-->
        <!--        <div class="orange">{{ group }}</div>-->
        <!--      </div>-->
        <!--    </div>-->
        <!--</template>-->
        
          </div>
          
          <button class="ui huge fluid orange button" type="submit">
            {{ submitText }}
          </button>
        </form>
      </div>
      <button @click="toggleMode()" class="ui small grey fluid button" type="submit">
        {{ toggleText }}
      </button>
    </div>
  </div>
</template>
<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';
import axios from "axios";

export default {
  name: 'Login',
  components: {
   // 読み込んだコンポーネント名をここに記述する
  },
  data() {
  // Vue.jsで使う変数はここに記述する
    return {
      isLogin: true,
      user: {
        userId: null,
        password: null,
        nickname: null,
        age: null
      },
    };
  },
  computed: {
  // 計算した結果を変数として利用したいときはここに記述する
    submitText() {
      return this.isLogin ? "ログイン": "新規登録";
    },
    toggleText() {
      return this.isLogin ? "新規登録はこちら": "ログインはこちら";
    },
  },
  methods: {
  // Vue.jsで使う関数はここで記述する
    toggleMode() {
      this.isLogin = !this.isLogin;
    },
    // 非同期操作→async
    async submit() {
      const path = this.isLogin? "/user/login": "/user/signup";
      const { userId, password, nickname, age } = this.user;
      const requestBody = this.isLogin
        ?{userId, password}
        :{userId, password, nickname, age};
      console.log(path, requestBody)
      
      try {
        const res = await axios.post(baseUrl + path, requestBody);
        
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('userId', this.user.userId);
        this.$router.push({name: "Home"});
      } catch(e) {
        console.log(e);
      }
    }
  },
}
</script>
<style scoped>
/* このコンポーネントだけに適用するCSSはここに記載する */
</style>