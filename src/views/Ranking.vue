<template>
  <div>
    <div class="ui main container">
      <!-- 検索ボックス -->
      <div class="ui segment">
        <form class="ui form">
          <label>{{myTeamRank}}&emsp;{{myTeamName}}&emsp;{{myTeamPoint}}</label>
          <br><br>
          <button @click="tweet()" class="ui orange button">
            <div class="ui header">
              <i class="twitter icon"></i>
              <div class="content">共有</div>
            </div>
          </button>
        </form>
      </div>
      
      <div class="ui center aligned segment">
        <h1>ランキング</h1>
      
        <ul class="ui column">
          <template v-for="(item, index) in rankingList">
            <li class="column" :key="index">
              <div class="ui fluid card" >
                <div class="content">
                  <label>{{index + 1}}位&emsp;{{item}}</label>
                </div>
              </div>
              <br>
            </li>
          </template>
        </ul>
      </div>
      
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
  name: 'User',
  components: {
  },
  data() {
  // Vue.jsで使う変数はここに記述する
    return {
      myTeamRank: "3位",
      myTeamName: "筋トレ部A",
      myTeamPoint: "1000pt",
      rankingList: ["筋トレ部A", "筋トレ部B", "筋トレ部C"]
    };
  },
  computed: {
  },
  methods: {
    tweet() {
      
    }
  
  },
  created: async function() {
    const token = window.localStorage.getItem('token');
    if (!token) { // tokenがなければloginに移動
      this.$router.push({name: "Login"});
    }
    const headers = {'Authorization': token};
    
    try {
      const res = await axios.get(baseUrl + "/users", {headers});
      // 成功処理
      this.users = res.data.users;
    }catch(e){
      // エラー処理
      alert("ユーザー情報が認証できませんでした．ログインし直してください．")
      this.$router.push({name: "Login"});
    }
  } 
}
</script>
<style scoped>
/* このコンポーネントだけに適用するCSSはここに記載する */
</style>