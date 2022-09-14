<template>
  <div>
    <div class="ui main container">
      
      <!--ローディング表示-->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>
      
      <div class="ui segment">
        <!--エラーメッセージ-->
        <p class="ui negative message" v-if="errorMsg">
          <i class="close icon" @click="clearMsg('error')"></i>
          <span class="header">エラーが発生しました！</span>
          {{ errorMsg }}
        </p>
        
        <!--更新成功メッセージ-->
        <p class="ui positive message" v-if="successMsg">
          <i class="close icon" @click="clearMsg('success')"></i>
          <span class="header">完了しました！</span>
          {{ successMsg }}
        </p>
        
        <form class="ui large form" @submit.prevent="submit">
          <div CLASS="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" placeholder="ID" v-model="user.userId" required disabled>
            </div>
          </div>
          
          <div CLASS="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="text" placeholder="Password" v-model="user.password">
            </div>
          </div>
          
          <div CLASS="field">
            <div class="ui left icon input">
              <i class="tag icon"></i>
              <input type="text" placeholder="Nickname" v-model="user.nickname">
            </div>
          </div>
          
          <div CLASS="field">
            <div class="ui left icon input">
              <i class="calendar icon"></i>
              <input type="text" placeholder="Age" v-model="user.age">
            </div>
          </div>
          
          <button class="ui huge fluid orange button" v-bind:disabled="submitDisabled" type="submit">
            更新
          </button>
        </form>
      </div>
      <button @click="deleteUser" class="ui small grey fluid button" type="submit">
        退会
      </button>
      <div class="ui segment">
        <div class="ui header">
          <i class="user circle icon"></i>
          <div class="content">所属グループ名</div>
        </div>
        <div class="ui orange huge label">筋トレ部A</div>
      </div>
      <div class="ui segment">
        <div class="centered">
          <h3 class="centered">おすすめ動画</h3>
          <yt-video videoId="g46tZN9J_2k" :width="966" :height="543" />
        </div>
      </div>
      <button class="ui huge orange fluid button" type="submit">
        食事をした
      </button>
    </div>
  </div>
</template>
<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
import YtVideo from "@/components/YtVideo.vue";
import { baseUrl } from '@/assets/config.js';
import axios from "axios";

export default {
  name: 'Mypage',
  components: {
   // 読み込んだコンポーネント名をここに記述する
   YtVideo,
  },
  data() {
  // Vue.jsで使う変数はここに記述する
    return {
      user: {
        userId: window.localStorage.getItem('userId'),
        password: null,
        nickname: null,
        age: null
      },
      successMsg: "",
      errorMsg: "",
      isCallingApi: false,
    };
  },
  computed: {
  // 計算した結果を変数として利用したいときはここに記述する
    submitDisabled() {
      const {userId, password, nickname, age} = this.user;
      return !(userId && password && nickname && age);
    }
  },
  methods: {
  // Vue.jsで使う関数はここで記述する
    clearMsg(target) {
      if (target === "success"){
        this.successMsg = ""
      } else if (target === "error") {
        this.errorMsg = ""
      }
    },
    async submit() {
      const headers = {'Authorization' : 'mtiToken'};
      
      const {userId, password, nickname, age} = this.user;
      
      const requestBody = {
        userId,
        password,
        nickname,
        age
      };
      
      try {
        const res = await axios.put(baseUrl + '/user', requestBody, {headers});
        // 成功時の処理
        console.log(res.data)
        this.successMsg = "ユーザー更新処理が完了しました";
      }catch(e){
        // エラー時の処理
        this.errorMsg = e;
      }
    },
    async deleteUser() {
      if (this.isCallingApi) {
        return;
      }
      this.isCallingApi = true;
      
      const headers = {'Authorization' : 'mtiToken'};
      
      const data = {
        userId: this.user.userId,
      }
      
      try {
        const res = await axios.delete(baseUrl + '/user', {data, headers});
        // 成功処理
        console.log(res)
        this.$router.push({name: "Login"});
      }catch(e){
        // エラー処理
        this.errorMsg = e;
      }finally{
        this.isCallingApi = false;
      }
    }
  },
  created: async function() {
    this.isCallingApi = true;
    
    const token = window.localStorage.getItem('token');
    if (!token) { // tokenがなければloginに移動
      this.$router.push({name: "Login"});
    }
    const headers = {'Authorization': token};
    
    try {
      const res = await axios.get(baseUrl + `/user?userId=${this.user.userId}`, {headers});
      // 成功処理
      this.user.nickname = res.data.nickname;
      this.user.age = res.data.age;
    }catch(e){
      // エラー処理
      this.errorMsg = e;
    }finally{
      this.isCallingApi = false;
    }
  }
}
</script>
<style scoped>
/* このコンポーネントだけに適用するCSSはここに記載する */
</style>