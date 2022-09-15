<template>
  <div>
    <div class="ui main container">
      <!--ローディング表示-->
      <div class="ui active inverted page dimmer" v-if="isCallingApi">
        <div class="ui text loader">Loading</div>
      </div>
      
      <div class="ui segment">
        <div class="ui header">
          <i class="users icon"></i>筋トレ部A
        </div>
        <div class="content">筋トレポイント:{{groupPoint}}pt</div>
      </div>
      
      <div class="ui right aligned segment">
        <form class="ui form" >
          <div class="ui field">
            <div class="ui input">
              <!--<input type="textarea" placeholder="本文">-->
              <textarea placeholder="グループに筋トレの報告をしましょう！" v-model="post.text"></textarea>
            </div>
            
            <div class="ui field">
              <button  @click="postArticle" class="ui orange large button" type="submit">
                <i class="edit icon"></i> 投稿
              </button>
            </div>
          </div>
        
        </form>
      </div>
      
      <div class="ui segment">
        <div class="ui dividing header">
            <i class="chat icon"></i>
            グループチャット
          </div>
        <div class="ui comments">
        <template v-for="(article, index) in articles">
          <div v-bind:key="index" class="ui segment inverted orange article-card" v-if="isMyArticle(article.userId)">
            <div class="comment">
              <div class="content">
                <div class="author"> {{ article.userId }} </div>
                <div class="metadata"><span class="date"> {{ dateTime[index] }} </span></div>
                <div class="text"> {{ article.text }} </div>
                <!--<div v-if="hasCategory[index]" class="ui orange label large"> {{ article.category }} </div>-->
                <div v-if="isMyArticle(article.userId)" class="mini ui button article-delete">
                  <i class="close icon"></i>削除
                </div>
              </div>
            </div>
          </div>
          <div v-bind:key="index" class="ui segment orange article-card" v-if="!isMyArticle(article.userId)">
            <div class="comment">
              <div class="content">
                <div class="author"> {{ article.userId }} </div>
                <div class="metadata"><span class="date"> {{ dateTime[index] }} </span></div>
                <div class="text"> {{ article.text }} </div>
                <!--<div v-if="hasCategory[index]" class="ui orange label large"> {{ article.category }} </div>-->
                <!--<div v-if="isMyArticle(article.userId)" class="mini ui button article-delete">削除</div>-->
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
      groupPoint: 0,
      groupId:  window.localStorage.getItem('groupId'),
      iam: null,
      // isMyId: [],
      hasCategory: [],
      dateTime: [],
      isCallingApi: false
    };
  },
  computed: {
  },
  
  created: async function() {
     this.isCallingApi = true;
    
    // const token = window.localStorage.getItem('token');
    // if (!token) { // tokenがなければloginに移動
    //   this.$router.push({name: "Login"});
    // }
    // const headers = {'Authorization': token};
    
    // try {
    //   const res = await axios.get(baseUrl + "/users", {headers});
    //   // 成功処理
    //   this.users = res.data.users;
    // }catch(e){
    //   // エラー処理
    //   alert("ユーザー情報が認証できませんでした．ログインし直してください．")
    //   this.$router.push({name: "Login"});
    // }
    
    
    await this.getArticles();
    await this.getPoint();
    
    this.articles.sort(function(a,b){
      if(a.timestamp > b.timestamp)return 1;
      else if(a.timestamp < b.timestamp)return -1;
      else return 0;
    });
    this.articles.reverse();
    
    this.articles.forEach((article) => {
      this.isMyArticle(article.userId);
      this.convertToLocaleString(article.timestamp);
      this.hasSomeCategory(article.category);
    })
    
    this.isCallingApi = false;
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
    
    async getPoint() {
      try {
        const res = await axios.get(baseUrl + `/group_point/total?groupId=group1`);
        // 成功処理
        this.groupPoint = res.data.userPoint;
        console.log(this.groupPoint);
      }catch(e){
        // エラー処理
      }
    },
    
    async getArticles() {// 記事一覧を取得する
    try {
      const res = await axios.get(baseUrl + `/articles?groupId=${ this.groupId }`);
      this.articles = res.data;
      console.log(this.articles)
    } catch (e){
      //error処理
      console.log(e);
    }
    }, 
     async postArticle() {// 記事を作成する
      // リクエストボディを指定する
      let requestBody = {
        userId: window.localStorage.getItem('userId'),
        text: this.post.text,
      };
      
      try {
        const res = await axios.post(baseUrl + '/article', requestBody);
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