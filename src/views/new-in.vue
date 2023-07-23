<template>
    <div class="emoji-details-page">
      <div class="emoji-card">
        <img :src="getFullImageUrl(emoji.attributes.singleEmoji.data.attributes.url)" :alt="emoji.attributes.name" class="emoji-image">
        <div class="emoji-details">
          <h2 class="emoji-name">{{ emoji.attributes.name }}</h2>
          <p class="emoji-description">{{ emoji.attributes.detail }}</p>
        </div>
      </div>
      <button class="back-btn" @click="goBack">返回</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        emoji: null
      };
    },
    created() {
      this.fetchEmojiDetails();
    },
    methods: {
      async fetchEmojiDetails() {
        try {
          const emojiId = this.$route.params.id;
          const response = await fetch(`https://sapi.kjchmc.cn/api/emojis/${emojiId}?populate=singleEmoji`);
          const data = await response.json();
          this.emoji = data.data;
        } catch (error) {
          console.error('Failed to fetch emoji details:', error);
        }
      },
      goBack() {
        // 返回上一页
        // 可以根据需要自定义返回逻辑或使用 Vue Router 进行导航
        this.$router.go(-1); // 使用 Vue Router 进行返回导航
      },
      getFullImageUrl(url) {
        return `https://sapi.kjchmc.cn${url}`;
      }
    }
  };
  </script>
  
  <!-- <style>
  .emoji-details-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .emoji-card {
    border-radius: 8px;
    background-color: #f8f8f8;
    padding: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .emoji-image {
    width: 120px;
    height: 120px;
    margin-right: 10px;
  }
  
  .emoji-details {
    flex-grow: 1;
  }
  
  .emoji-name {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }
  
  .emoji-description {
    font-size: 18px;
    color: #777;
    margin-bottom: 10px;
  }
  
  .back-btn {
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
    background-color: #4285f4;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  </style> -->
  