<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui form" @submit.prevent="postArticle">
          <div CLASS="field">
            <div class="ui input">
              <!--<input type="textarea" placeholder="本文">-->
              <textarea placeholder="あなたの投稿を発信しましょう" v-model="post.text"></textarea>
            </div>
            
            <div class="field">
              <div class="inline fields">
                <div class="field">
                  <label>カテゴリー</label>
                  <input type="text" v-model="post.category" />
                </div>
              </div>
              <button class="ui orange button" type="submit">投稿</button>
            </div>
          </div>
        
        </form>
      </div>
      
      <div class="ui segment">
        <form class="ui form" @submit.prevent="getSearchedArticles">
          <div class="field">
            <label>ユーザー名</label>
            <input type="text" placeholder="ユーザーID" v-model="search.userId" />
          </div>
          
          <div class="field">
            <label>カテゴリー名</label>
            <input type="text" placeholder="カテゴリ" v-model="search.category" />
          </div>
          
          <div class="field">
            <label>投稿日時</label>
            <div class="inline fields">
              <div class="field">
                <input type="text" v-model.number="search.start" />
                <label>から</label>
              </div>
              
              <div class="field">
                <input type="text" v-model.number="search.end" />
                <label>
                  まで
                </label>
              </div>
            </div>
          </div>
          <button class="ui orange button" type="submit">検索</button>
        </form>
      </div>
      
      <ul class="ui comments divided articles">
        <template v-for="(article, index) in articles">
          <li v-bind:key="index" class="ui segment article-card ">
            <h2 class="article-title"> {{ article.userId }} </h2>
            <span class="article-time"> {{ dateTime[index] }} </span>
            <p class="article-text"> {{ article.text }} </p>
            <div v-if="hasCategory[index]" class="ui orange label large"> {{ article.category }} </div>
            <div v-if="isMyArticle(article.userId)" class="mini ui button article-delete">削除</div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
// 必要なものはここでインポートする
// @は/srcと同じ意味です
// import something from '@/components/something.vue';
import { baseUrl } from '@/assets/config.js';
import axios from "axios";

// const headers = {'Authorization' : 'mtiToken'};

export default {
  name: 'Group',
  components: {
   // 読み込んだコンポーネント名をここに記述する
  },
  data() {
    // Vue.jsで使う変数はここに記述する
    return {
      post: {
        text: null,
        category: null,
      },
      search: {
        userId: null,
        category: null,
        start: null,
        end: null,
      },
      articles: [],
      iam: null,
      // isMyId: [],
      hasCategory: [],
      dateTime: [],
    };
  },
  computed: {
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
    
    await this.getArticles();
    
    this.articles.forEach((article) => {
      this.isMyArticle(article.userId);
      this.convertToLocaleString(article.timestamp);
      this.hasSomeCategory(article.category);
    })
    
    // this.articles.forEach((article) => {
    // })
    
  },

  methods: {
    // Vue.jsで使う関数はここで記述する
    isMyArticle(id) {// 自分の記事かどうかを判定する
      // this.isMyId.push(id === window.localStorage.getItem("userId"));
      return id === window.localStorage.getItem("userId");
    },
    
    hasSomeCategory(category) {
      this.hasCategory.push(typeof category !== "undefined");
    },
    
    async getArticles() {// 記事一覧を取得する
      const headers = {'Authorization' : 'mtiToken'};
    try {
      const res = await axios.get(baseUrl + "/articles", { headers });
      this.articles = res.data;
    } catch (e){
      //error処理
    }
    }, 
    async postArticle() {// 記事を作成する
      // headerを指定する
      const headers = {'Authorization' : 'mtiToken'};
      // リクエストボディを指定する
      let requestBody = {
        userId: window.localStorage.getItem('userId'),
        text: this.post.text,
      };
      if (this.post.category){
        requestBody.category = this.post.category;
      }
      
      try {
        const res = await axios.post(baseUrl + '/article', requestBody, { headers });
        console.log(res);
        
      }catch(e){
        console.log(e)
      }
    }, 
    async getSearchedArticles() {// 記事を検索する
      const headers = {'Authorization' : 'mtiToken'};
      console.log("getSearchArticles do");
      let pass = `/articles?userId=${this.search.userId}`;
      if (this.search.category) {
        pass += `&category=${this.search.category}`;
      }
      if (this.search.start) {
        pass += `&start=${this.search.start}`;
      }
      if (this.search.end) {
        pass += `&end=${this.search.end}`;
      }
          
      try {
        const res = await axios.get(baseUrl + pass , {
          headers
        });
        this.articles = res.data;
        console.log(this.articles);
      }catch(e){
        //error処理
      }
    }, 
    async deleteArticle(article) {// 記事を削除する
      const headers = {'Authorization' : 'mtiToken'};
      
      const data = {
        userId: article.userId,
        timestamp: article.timestamp
      }
      
      try {
        const res = await axios.delete(baseUrl + '/article', {data, headers });
        console.log(res);
        
      }catch(e){
        console.log(e)
      }
    }, 
    convertToLocaleString(timestamp) {// timestampをLocaleDateStringに変換する
      const now = new Date(timestamp);
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hour = now.getHours();
      const min = now.getMinutes();
      const sec = now.getSeconds();
      const res = year + "/" + month + "/" + date + " " + hour + ":" + min + ":" + sec;
      this.dateTime.push(res);
    } 
  }
}
</script>

<style scoped>
</style>