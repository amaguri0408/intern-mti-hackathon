<template>
  <div>
    <div class="ui main container">
      
      <!--ローディング表示-->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>
      <!-- 検索ボックス -->
      <div class="ui segment">
        <div class="field">
          <div class="ui center aligned header">
            <i class="users icon"></i> {{myrank.groupname}}
          </div>
          <div class="field">
            
            <button @click="tweet()" class="ui right floated mini button">
            <div class="ui header">
              <i class="twitter icon"></i>
              <div class="content">共有</div>
            </div>
            </button>
            <div class="ui center aligned header">
              {{myrank.rank}}
              <p>{{myrank.totalPoint}}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="ui center aligned segment">
        <div class="ui header">
          <i class="trophy icon"></i> ランキング
        </div>
      
        <div class="ui list">
          <template v-for="(item, index) in ranking">
            <div class="column" :key="index">
              <div class="ui fluid card" >
                {{index + 1}}位
                <div class="content">
                  <!--<label>{{index + 1}}位&emsp;{{item.groupname}}</label>-->
                  <div class="header">{{item.groupname}}</div>
                  {{item.totalPoint}}pt
                </div>
              </div>
            </div>
          </template>
        </div>
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
  name: 'Ranking',
  components: {
  },
  data() {
  // Vue.jsで使う変数はここに記述する
    return {
      // myTeamRank: "3位",
      // myTeamName: "筋トレ部A",
      // myTeamPoint: "1000pt",
      // rankingList: ["筋トレ部A", "筋トレ部B", "筋トレ部C"],
      ranking: [{
        groupId: null,
        groupname: null,
        rank: null,
        totalPoint: null
      }],
      myrank: {
        groupname: null,
        rank: null,
        totalPoint: null,
      },
      isCallingApi: false
    };
  },
  computed: {
  },
  methods: {
    tweet() {
      
    }
  
  },
  created: async function() {
    this.isCallingApi = true;
    const token = window.localStorage.getItem('token');
    if (!token) { // tokenがなければloginに移動
      this.$router.push({name: "Login"});
    }
    const headers = {'Authorization': token};
    const groupId = window.localStorage.getItem('groupId');
    
    try {
      const res = await axios.get(baseUrl + "/group_point/ranking", {headers});
      // 成功処理
      this.ranking = res.data.groupRanking;
      console.log(res.data);
    }catch(e){
      // エラー処理
      alert("ユーザー情報が認証できませんでした．ログインし直してください．");
      this.$router.push({name: "Login"});
    }
    
    try {
      const res = await axios.get(baseUrl + `/group_point/rank?groupId=${groupId}`, {headers});
      // 成功処理
      this.myrank = res.data;
      console.log(res.data);
    }catch(e){
      // エラー処理
      alert("ユーザー情報が認証できませんでした．ログインし直してください．");
      // this.$router.push({name: "Login"});
    }
    this.isCallingApi = false;
  } 
}
</script>
<style scoped>
/* このコンポーネントだけに適用するCSSはここに記載する */
</style>