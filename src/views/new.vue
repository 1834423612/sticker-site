import { router } from '../router/index'; // 根据你的项目结构，导入 Vue Router 对象

<template>
    <div class="app">
      <header class="header">
        <div class="header-content">
          <h1 class="title">表情包展示网站</h1>
          <input type="text" v-model="searchText" placeholder="搜索表情包" class="search-input">
        </div>
      </header>
      <main>
        <h2 class="section-title">随机表情包</h2>
        <div class="emoji-list">
          <div
            v-for="emoji in displayedEmojis"
            :key="emoji.id"
            class="emoji-card"
            @click="goToEmojiDetails(emoji)"
          >
            <img :src="getFullImageUrl(emoji.attributes.singleEmoji.data.attributes.url)" alt="表情包" class="emoji-image">
            <div class="emoji-details">
              <h3 class="emoji-name">{{ emoji.attributes.name }}</h3>
              <p class="emoji-description">{{ emoji.attributes.detail }}</p>
            </div>
          </div>
        </div>
        <button class="change-emojis-btn" @click="changeEmojis">换一批</button>
      </main>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchText: '',
        emojis: [],
        displayedEmojis: []
      };
    },
    async mounted() {
      await this.fetchEmojis();
      this.changeEmojis();
    },
    methods: {
      async fetchEmojis() {
        try {
          const response = await fetch('https://sapi.kjchmc.cn/api/emojis?populate=singleEmoji');
          const data = await response.json();
          this.emojis = data.data;
        } catch (error) {
          console.error('Failed to fetch emojis:', error);
        }
      },
      shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      },
      getRandomEmojis() {
        const shuffledEmojis = this.shuffleArray(this.emojis);
        return shuffledEmojis.slice(0, 3);
      },
      changeEmojis() {
        this.displayedEmojis = this.getRandomEmojis();
      },
      goToEmojiDetails(emoji) {
        // 跳转到表情包详情页面
        this.$router.push({ name: 'newIn', params: { id: emoji.id } });
      },
      getFullImageUrl(url) {
        return `https://sapi.kjchmc.cn${url}`;
      }
    }
  };
  </script>
  
  <style>
  .app {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .header {
    background-color: #f5f5f5;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .header-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .title {
    font-size: 28px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .search-input {
    padding: 8px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  .section-title {
    font-size: 24px;
    color: #555;
    margin-bottom: 10px;
  }
  
  .emoji-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .emoji-card {
    border-radius: 8px;
    background-color: #f8f8f8;
    padding: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .emoji-image {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }
  
  .emoji-details {
    flex-grow: 1;
  }
  
  .emoji-name {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
  }
  
  .emoji-description {
    font-size: 14px;
    color: #777;
  }
  
  .change-emojis-btn {
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    background-color: #4285f4;
    color: #fff;
    border: none;
    cursor: pointer;
    margin-top: 20px;
  }
  </style>
  