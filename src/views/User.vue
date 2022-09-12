<template>
  <div>
    <div class="ui main container">
      <!-- 検索ボックス -->
      <div class="ui segment">
        <form class="ui form">
          <div class="field">
            <label>ユーザー名</label>
            <input type="text" placeholder="Nickname" v-model="nickname" />
          </div>
          
          <div class="field">
            <label>年齢</label>
            <div class="inline fields">
              <div class="field">
                <input type="text" v-model.number="start" name="agestart" />
                <label>歳から</label>
              </div>
              
              <div class="field">
                <input type="text" v-model.number="end" name="ageend" />
                <label>
                  歳まで
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <!-- ユーザー一覧 -->
      <ul class="ui three column grid">
        <template v-for="(item, index) in filteredUsers">
          <li class="column" :key="index">
            <div class="ui card fluid" >
              <div class="content">
                <h2 class="header">
                  {{ item.nickname }}
                  <span class="ui green label">{{ item.age }}</span>
                </h2>
                <span class="meta">{{ item.userId }} </span>
              </div>
            </div>
          </li>
        </template>
        <!--<templete v-for="(item, index) in users" :key="index">-->
        <!--  <li class="column" v-for="(item, index) in filteredUsers" :key="index">-->
        <!--    <div class="ui card fluid">-->
        <!--      <div class="content">-->
        <!--        <h2 class="header">-->
        <!--          {{ item.nickname }}-->
        <!--          <span class="ui green label">{{ item.age }}</span>-->
        <!--        </h2>-->
        <!--        <span class="meta">{{ item.userId }}</span>-->
        <!--      </div>-->
        <!--    </div>-->
        <!--  </li>-->
        <!--</templete>-->
      </ul>
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
      users: [],
      nickname: "",
      start: 0,
      end: 100,
    };
  },
  computed: {
  // 計算した結果を変数として利用したいときはここに記述する
    filteredUsers() {
      console.log("!")
      return this.users.filter(e => 
        e.nickname?.match(this.nickname) 
        && e.age >= this.start
        && e.age <= this.end
      );
    }
  },
  methods: {
  // Vue.jsで使う関数はここで記述する
    // filteredUsers() {
    //   console.log("!")
    //   return this.users.filter(e => 
    //     e.nickname?.match(this.nickname) 
    //     && e.age >= this.start
    //     && e.age <= this.end
    //   );
    // }
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