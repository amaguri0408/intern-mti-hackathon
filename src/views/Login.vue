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
              <input type="password" placeholder="Password" v-model="user.password">
            </div>
          </div>
          
          <div class="field" v-if="!isLogin">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input type="text" placeholder="Nickname" v-model="user.nickname">
            </div>
          </div>
          
          <div class="field" v-if="!isLogin">
            <div class="field">
              <div class="field">
              <div class="ui radio checkbox">
                <input type="radio" name="type" value="alone" @click="check()">
                <label>一人で始める</label>
              </div>
            </div>
            
            <div class="field" value="together">
              <div class="ui radio checkbox">
                <input type="radio" name="type" @click="unCheck()">
                <label>友達と始める</label>
              </div>
            </div>
            </div>
            
            <div class="field" v-if="isCheck">
              <div class="ui dividing header">
                <i class="users small icon"></i>グループ選択
              </div>
            
          <template v-for="(group,index) in groups">
            <div v-bind:key="index" class="field">
              <button class="ui toggle orange button" type="button" @click="chooseGroup(group.groupId)">
                {{ group.name }}
              </button>
            </div>
          </template>
            </div>
        
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
      group: {
        name: null,
        groupId: null
      },
      isCheck: false,
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
    check() {
      this.isCheck = true;
    },
    unCheck() {
      this.isCheck = false;
    },
    chooseGroup(groupId) {
      this.group.groupId = groupId; 
      console.log(groupId);
    },
    // 非同期操作→async
    async submit() {
      const path = this.isLogin? "/user/login": "/user/signup";
      const { userId, password, nickname, age } = this.user;
      const groupId = this.group.groupId;
      console.log(groupId);
      const requestBody = this.isLogin
        ?{userId, password}
        :{userId, password, nickname, age, groupId};
      console.log(path, requestBody)
      
      try {
        const res = await axios.post(baseUrl + path, requestBody);
        
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('userId', this.user.userId);
        window.localStorage.setItem('groupId', this.group.groupId);
        this.$router.push({name: "Mypage"});
      } catch(e) {
        console.log(e);
      }
    },
  },
  created: async function() {
    try {
      const res = await axios.get(baseUrl + "/groups");
      // 成功処理
      this.groups = res.data.groups;
    }catch(e){
      // エラー処理
      alert("グループの取得に失敗しました．")
      this.$router.push({name: "Login"});
    }
    
  }
}
</script>
<style scoped>
/* このコンポーネントだけに適用するCSSはここに記載する */
</style>