<template>
  <div>
    <div class="ui main container">
      <!-- 基本的なコンテンツはここに記載する -->
      <div class="ui segment">
        <form class="ui large form" @submit.prevent="submit">
          <div CLASS="field">
            <div class="ui input">
              <!--<input type="textarea" placeholder="本文">-->
              <textarea placeholder="本文"></textarea>
            </div>
            <label>カテゴリー</label>
          </div>
        
        </form>
      </div>
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