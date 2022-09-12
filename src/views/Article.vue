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
              <button class="ui green button" type="submit">投稿</button>
            </div>
          </div>
        
        </form>
      </div>
      
      <div class="ui segment">
        <form class="ui form" @submit.prevent="getSearchedArticle">
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
          <button class="ui green button" type="submit">検索</button>
        </form>
      </div>
      
      <ul class="ui comments divided">
        <template v-for="(article, index) in articles">
          <li v-bind:key="index">{{ article }}</li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
// 必要なものはここでインポートする
// @は/srcの同じ意味です
// import something from '@/components/something.vue';
// import { baseUrl } from '@/assets/config.js';
// import axios from "axios";

export default {
  name: 'Template',
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
      iam: null
    };
  },
  computed: {
  // 計算した結果を変数として利用したいときはここに記述する
  },
  methods: {
  // Vue.jsで使う関数はここで記述する
  },
}
</script>
<style scoped>
/* このコンポーネントだけに適用するCSSはここに記載する */
</style>