<template>
  <div id="app">
    <el-container>
      <el-header>
        <span class="back-arrow" style="" @click="$router.push('/')">
          <el-icon><Back /></el-icon>
        </span>

        <img
          src="https://img-static.mihoyo.com/communityweb/upload/8ad34e2b55cd5aca17bdb1bbd50c8ec7.png"
          alt=""
          style="width: 50px"
          class="logo"
        />

        <!-- 搜索框 -->
        <div class="search_box">
          <input
            class="search_box_inner"
            spellcheck="false"
            placeholder="请输入角色名称"
            v-model="searchVal"
            ref="c_input"
          />
        </div>

        <!-- 分组 -->
        <el-select v-model="list_num" placeholder="请选择分区">
          <el-option
            v-for="(dataObj, index) in apiData"
            :key="dataObj.id + '+' + index"
            :label="dataObj.name"
            :value="index"
            v-show="dataObj.is_available"
          >
            <span>{{ index }}、</span>
            <span>{{ dataObj.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px"
              >{{ dataObj.num }}枚</span
            >
          </el-option>
        </el-select>

        <div
          class="el-icon-download"
          v-show="itemList.length"
          @click="all_download_confirm"
        >
          ALL DOWNLOAD
        </div>

        <!-- 相关信息 -->
        <span class="about" v-show="!itemList.length"
          ><a href="https://space.bilibili.com/96466254" target="_blank"
            >@胡桃的精通沙</a
          ></span
        >
      </el-header>

      <el-main>
        <!-- 展示区 -->
        <div class="main">
          <div v-for="(item, index) in itemList" :key="item.id + item.name">
            <div class="itemFra">
              <!-- <img  :src="item.icon" /> -->
              <el-image :key="index" :src="item.icon" lazy></el-image>
              <span class="item_name">{{ item.name }}</span>
              <div class="btn-fun">
                <el-button type="text" size="mini" @click="copyLink(item.icon)"
                  >复制链接</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  @click="urlToBase64AndDownload(item.icon, item.name)"
                  >下载</el-button
                >
              </div>

              <span style="font-size: 14px; margin-bottom: 3px">{{
                index + 1
              }}</span>
              <!-- <span>{{dayjs.unix(item.updated_at).format("YYYY-MM-DD")}}</span> -->
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
//通过json文件路径引入
import jsonData from "./search/API.json";
import FileSaver from "file-saver";
import JSZip from "jszip";
import axios from "axios";

export default {
  name: "App",
  components: {},

  data() {
    return {
      apiData: [], //从json文件读得数据

      itemList: [], // 展示分区数据；展示搜索结果

      list_num: "", //【分区】选择的是哪个

      searchVal: "", //输入关键字
    };
  },
  methods: {
    // 搜索
    item_search(val, add = true) {
      let keyWord = val.toLowerCase();
      let arr = [];
      let arr_item = "";
      for (var i = 0; i < this.apiData.length; i++) {
        arr_item = this.apiData[i].list.filter((item) =>
          item.name.toLowerCase().includes(keyWord)
        );
        for (var j = 0; j < arr_item.length; j++) {
          arr.push(arr_item[j]);
        }
      }
      this.itemList = arr;
      if (this.itemList.length) {
        if (add) this.add_charactor_search(val); //添加至查询历史列表
      }
    },

    //将图片转化为base64再进行下载
    urlToBase64AndDownload(url, name) {
      //实例化一个img对象
      const img = new Image();
      //设置img的图片路径
      img.src = url;
      //设置跨域解决
      img.setAttribute("crossOrigin", "Anonymous");
      //img加载完后处理
      img.onload = function () {
        //创建一个canvas对象
        const canvas = document.createElement("canvas");
        //把图片的宽度设为canves的宽度
        canvas.width = img.width;
        //把图片的高度设为canves的高度
        canvas.height = img.height;
        //创建一个2d画布
        const ctx = canvas.getContext("2d");
        // 将img中的内容画到画布上
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 将画布内容转换为base64
        let base64 = canvas.toDataURL();
        // 创建a链接
        const a = document.createElement("a");
        a.href = base64;
        a.download = name;
        // 触发a链接点击事件，浏览器开始下载文件
        a.click();
      };
    },

    all_download_confirm() {
      this.$confirm("确认下载？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "开始下载",
          });
          this.downImg_zip();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下载",
          });
        });
    },

    //打包下载
    downImg_zip() {
      var blogTitle = "米游社" + Date.now();
      var zip = new JSZip();
      var imgs = zip.folder(blogTitle);
      var baseList = [];
      var arr = []; // 要下载图片的url
      var imgNameList = []; // 下载后图片的文件名，个数应与arr对应

      for (i = 0; i < this.itemList.length; i++) {
        arr.push(this.itemList[i].icon);
        imgNameList.push(this.itemList[i].name);
      }

      for (var i = 0; i < arr.length; i++) {
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");

        image.onload = function () {
          let canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;

          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);

          let url = canvas.toDataURL(); // 得到图片的base64编码数据
          canvas.toDataURL("image/png");

          baseList.push(url.substring(22)); // 去掉base64编码前的 data:image/png;base64,
          if (baseList.length === arr.length && baseList.length > 0) {
            for (let k = 0; k < baseList.length; k++) {
              imgs.file(imgNameList[k] + ".png", baseList[k], { base64: true });
            }
            zip.generateAsync({ type: "blob" }).then(function (content) {
              // see FileSaver.js
              FileSaver.saveAs(content, blogTitle + ".zip");
            });
          }
        };
        image.src = arr[i];
      }
    },

    //用于复制链接
    copyLink(link) {
      const input = document.createElement("input");
      input.style.cssText = "opacity: 0;display: none;";
      input.type = "text";
      input.value = link; // 修改文本框的内容
      document.body.appendChild(input);
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      this.copy_success();
    },

    //复制成功
    copy_success() {
      this.$message({
        showClose: true,
        duration: 1000,
        type: "success",
        message: "复制成功!",
      });
    },

    // fetchEmojyApiData() {
    //   let url = "https://bbs-api.mihoyo.com/misc/api/emoticon_set";
    //   axios
    //     .get(url)
    //     .then(function (response) {
    //       console.log("response----", response);
    //       //   console.log("response----", response.data);
    //     });
    // },
  },

  watch: {
    // 搜索
    searchVal(val) {
      debounce(() => {
        if (val && val !== " ") {
          // console.log('开始查找');
          this.item_search(val);
        } else {
          // 清除关键字后 也清除搜索结果
          this.itemList = "";
        }
      }, 300);
    },

    // 分区选择
    list_num: {
      deep: true,
      handler() {
        this.itemList = this.apiData[this.list_num].list;
        // console.log('itemList', this.itemList);
      },
    },
  },
  created() {},

  mounted() {
    this.apiData = jsonData.data.list; //读取API.json
  },
};

// 用于搜索延时 去除卡顿
const debounce = (function () {
  let timer = 0;
  return function (func, delay) {
    clearTimeout(timer);
    timer = setTimeout(func, delay);
  };
})();
</script>

<style lang="scss" scoped>
/* 引入自定义滚动条 */
@import "@/components/css/scrollbar.css";

el-container {
  margin: 0;
  padding: 0;
}

#app {
  overflow: scroll;
  overflow-x: hidden;
  background-color: #fff4e3;
}

.el-header {
  height: 60px;
  background-color: #454d5c;
  display: flex;
  align-content: center;
  //   justify-content: space-evenly;
  justify-content: space-around;
  align-items: center;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 3;

  .back-arrow {
    color: white;
    font-size: 24px;
  }

  .back-arrow:hover {
    color: #79bbff;
  }
  .input_button {
    margin-bottom: 20px;
  }

  .search_box {
    text-align: left;
    width: 35%;
    height: 43px;
    border-radius: 30px;
    overflow: hidden;
  }

  .search_box_inner {
    outline: 0;
    border: none;
    width: 100%;
    height: 100%;
    /* background-color: rgba(255, 255, 255, 0.5); */
    font-size: 15px;
    text-align: center;
  }

  .search_box_inner::-webkit-input-placeholder {
    color: #dbdbdc;
  }

  .about {
    font-size: 13px;
    text-align: left;
    display: flex;
    flex-direction: column;
  }

  a {
    text-decoration: none;
    color: #fff;
  }
  a:hover,
  .el-button--text:hover,
  .el-icon-download:hover {
    color: #f27474;
    cursor: pointer;
  }

  .el-icon-download {
    font-size: 16px;
    color: white;
    font-weight: bold;
    text-align: center;
  }
}

.el-main {
  z-index: 2;

  .main {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-gap: 20px;
  }

  .itemFra {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: aliceblue;
    border-radius: 5px;
  }

  .itemFra:hover {
    border: red 3px solid;
    margin: -3px;
  }

  .itemFra img {
    width: 100px;
    height: 100px;
    margin-top: 5px;
  }

  .item_name {
    margin-top: 5px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .btn-fun {
    display: flex;
  }
}

::-webkit-scrollbar {
  width: 5px;
}

/*  改变滚动条的内容 */
// ::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   background-color: rgb(238, 63, 78);
// }

@media screen and (max-width: 1137px) {
  .el-header .about {
    display: none;
  }
}

/* 宽度自适应 */
@media screen and (max-width: 1350px) {
  .el-main .main {
    grid-template-columns: repeat(7, 1fr);
  }
}
@media screen and (max-width: 1200px) {
  .el-main .main {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media screen and (max-width: 1000px) {
  .el-main .main {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media screen and (max-width: 850px) {
  .el-main .main {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 700px) {
  .el-main .main {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>