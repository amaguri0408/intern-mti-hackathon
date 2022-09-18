<template>
  <div>
    <div class="ui main container">
      
      <section @click="closeModal()" id="modalArea" class="modalArea">
        <div id="modalBg" class="modalBg"></div>
        <div class="modalWrapper">
          <div class="modalContents">
            <h1>完了</h1>
            <p style="size: 50px;">筋トレポイント100pt獲得！<br></p>
          </div><br>
          <div id="closeModal" class="closeModal">
            ×
          </div>
          <button @click="pushGroup()" class="ui fluid orange button" type="submit">
            グループ画面へ進む
          </button>
        </div>
      </section>
      
      <div class="ui small modal test">
        <i class="close icon"></i>
        <div class="header">
          Profile Picture
        </div>
        <div class="actions">
          <div class="ui black deny button">
            Nope
          </div>
        </div>
      </div>
      
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
          <div class="ui header">
            <i class="id card outline icon"></i>
            <div class="content">ユーザー情報</div>
          </div>
          
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
              <input type="text" placeholder="Username" v-model="user.username">
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
        <div class="ui orange huge label">{{ groupname }}</div>
        
        <div class="ui header">
          <i class="star outline icon"></i>
          <div class="content">筋トレpoint</div>
        </div>
        <div class="ui huge label">{{ userPoint }}pt</div>
      </div>
      
      <div class="ui segment">
        <div class="ui header">
          <i class="video play icon"></i>
          <div class="content">おすすめ動画</div>
        </div>
        <yt-video videoId="g46tZN9J_2k" :width="966" :height="543" />
        <button @click="trainingFinish()" class="ui huge fluid orange button" disabled=true type="submit">
          運動完了
        </button>
      </div>
      
      <button @click="toggleEat()" class="ui huge orange fluid button" type="submit" v-if="!isMeal">
        食事をした
      </button>
      <div class="ui segment" v-if="isMeal">
        <div class="ui header">
          <i class="clock outline icon"></i>
          <div class="content">おすすめ筋トレ時間</div>
          <button @click="deleteMealHistory()" class="ui button right floated" type="submit">
            キャンセル
          </button>
        </div>
        <div>食事時間：{{ convertToLocaleTimeString(mealTimestamp) }}</div>
        <div class="ui big label">
          {{ convertToLocaleTimeString(recommendTime.start) }}~
          {{ convertToLocaleTimeString(recommendTime.end) }}
        </div>
      </div>
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
        groupId: window.localStorage.getItem('groupId'),
        username: null,
        age: null
      },
      groupname: null,
      userPoint: null,
      successMsg: "",
      errorMsg: "",
      isCallingApi: false,
      isMeal: false,
      mealTimestamp: null,
      mealHistoryId: null,
      recommendTime:{
        start: null,
        end: null
      },
    };
  },
  computed: {
  // 計算した結果を変数として利用したいときはここに記述する
    submitDisabled() {
      const {userId, password, username, age} = this.user;
      return !(userId && password && username && age);
    }
  },
  methods: {
  // Vue.jsで使う関数はここで記述する
    toggleMode() {
      this.isMeal = !this.isMeal;
    },
    clearMsg(target) {
      if (target === "success"){
        this.successMsg = ""
      } else if (target === "error") {
        this.errorMsg = ""
      }
    },
    convertToLocaleTimeString(timestamp) {
      const d = new Date(timestamp);
      return `${d.getHours()}:${d.getMinutes()}`
    },
    pushGroup(){
      this.$router.push({name: 'Group'})
    },
    async submit() {
      const headers = {'Authorization' : 'mtiToken'};
      
      const {userId, password, username, age} = this.user;
      
      const requestBody = {
        userId,
        password,
        username,
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
    },
    async trainingFinish() {
      this.isCallingApi = true;
      
      let requestBody = {
        userId: this.user.userId,
        point: 100
      }
      this.userPoint += 100;
      
      try {
        await axios.post(baseUrl + "/user_point", requestBody);
        // 成功処理
      }catch(e){
        // エラー処理
        this.errorMsg = e;
        console.log(e)
        
      }
      
      requestBody = {
        userId: this.user.userId,
        text: `${this.user.userId}さんが筋トレをしました！\n100pt獲得！！`,
      };
      
      try {
        const res = await axios.post(baseUrl + '/article', requestBody);
        console.log(res);
        const modalArea = document.getElementById('modalArea');
        modalArea.classList.toggle('is-show');
        
      }catch(e){
        this.errorMsg = e;
        console.log(e)
      }finally{
        this.isCallingApi = false;
      }
    },
    closeModal() {
      const modalArea = document.getElementById('modalArea');
      modalArea.classList.toggle('is-show');
    },
    async toggleEat() {
      this.isCallingApi = true;
      
      const requestBody = {
        userId: this.user.userId,
      }
      
      try {
        const res = await axios.post(baseUrl + "/meal_history", requestBody);
        console.log(res)
        this.isMeal = true;
        this.mealHistoryId = res.data.mealHistoryId
        this.mealTimestamp = res.data.timestamp;
        this.recommendTime.start = this.mealTimestamp + 60 * 60 * 1000 * 2;
        this.recommendTime.end = this.mealTimestamp + 60 * 60 * 1000 * 3;
      }catch(e){
        // エラー処理
        this.errorMsg = e;
      }finally{
        this.isCallingApi = false;
      }
    },
    async deleteMealHistory() {
      this.isCallingApi = true
      
      try {
        await axios.delete(baseUrl + `/meal_history?mealHistoryId=${this.mealHistoryId}`)
        this.isMeal = false;
      }catch(e){
        this.errorMsg = e;
        console.log(e)
      }finally{
        this.isCallingApi = false;
      }
    },
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
      this.user.username = res.data.username;
      this.user.age = res.data.age;
    }catch(e){
      // エラー処理
      this.errorMsg = e;
    }
    
    // 所属グループ名取得
    try {
      const res = await axios.get(baseUrl + `/group?groupId=${this.user.groupId}`, {headers});
      // 成功処理
      this.groupname = res.data.name;
    }catch(e){
      // エラー処理
      this.errorMsg = e;
    }
    
    // 所持ポイントを計算
    try {
      const res = await axios.get(baseUrl + `/user_point/total?userId=${this.user.userId}`, {headers});
      // 成功処理
      this.userPoint = res.data.userPoint;
    }catch(e){
      // エラー処理
      this.errorMsg = e;
    }
    
    // 食事したかどうか取得
    let path = `/meal_histories?userId=${this.user.userId}`;
    //今
    var _d = new Date();
    
    //同日の0時0分0秒
    var d = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), 0, 0, 0);
    const today_start = d.getTime();
    d = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate() + 1, 0, 0, 0);
    const today_end = d.getTime();
    
    path += `&start=${today_start}&end=${today_end}`
    try {
      const res = await axios.get(baseUrl + path);
      const mealHistories = res.data.mealHistories;
      if (mealHistories.length !== 0) {
        this.isMeal = true;
        console.log(mealHistories)
        const eatTime = mealHistories.sort((x, y) => {
          if (x.timestamp < y.timestamp) {
            return 1;
          } else {
            return -1;
          }
        });
        this.mealHistoryId = eatTime[0].mealHistoryId;
        this.mealTimestamp = eatTime[0].timestamp;
        this.recommendTime.start = this.mealTimestamp + 60 * 60 * 1000 * 2;
        this.recommendTime.end = this.mealTimestamp + 60 * 60 * 1000 * 3;
      }
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