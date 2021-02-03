new Vue({
  el: "#app",

  data() {
    return {
      engineLists: [
        {
          id: 7,
          name: "谷歌",
          url: "https://www.google.com/search?q=",
          icon: "gg.png",
        },
        {
          id: 1,
          name: "夸克",
          url: "https://quark.sm.cn/s?q=",
          icon: "kk.png",
        },
        {
          id: 3,
          name: "百度",
          url: "https://www.baidu.com/s?word=",
          icon: "bd.png",
        },
        {
          id: 2,
          name: "必应",
          url: "https://cn.bing.com/search?q=",
          icon: "by.png",
        },
        {
          id: 5,
          name: "知乎",
          url: "https://www.zhihu.com/search?q=",
          icon: "zh.png",
        },
        {
          id: 4,
          name: "segmentfault",
          url: "https://segmentfault.com/search?q=",
          icon: "sf.png",
        },
        {
          id: 6,
          name: "stackoverflow",
          url: " https://stackoverflow.com/search?q=",
          icon: "so.png",
        },
      ],
      searchKey: "",
      url: "",
      urlSearch: "",
      cureentEngine: null,
      isShow: false,
      isShowHistory: false,
      relevantLists: [],
      cureentSugText: "",
      keydownCount: 0,
    };
  },
  watch: {
    searchKey(val) {
      this.searchKey = val;
      this.urlSearch = `${this.url}${this.searchKey}`;
      if (!val) {
        // 没有搜索值显示历史记录
        this.isShowHistory = false;
        return;
      }
      this.handleSugSearch(val);
    },
  },
  methods: {
    setHistoryList(val) {
      var list = this.getHistoryList();
      if (list.indexOf(val) === -1) {
        list.unshift(val);
        localStorage.HISTORY_LISTS = JSON.stringify(list);
      }
    },
    getHistoryList() {
      return localStorage.HISTORY_LISTS
        ? JSON.parse(localStorage.HISTORY_LISTS)
        : [];
    },
    handleClickSearch(item) {
      this.url = item.url;
      this.cureentEngine = item;
      localStorage.SEARCH_ENGINE = JSON.stringify(this.cureentEngine);
      this.urlSearch = `${this.url}${this.searchKey}`;
      this.isShow = false;
    },
    handleSugClickSearch(val) {
      this.searchKey = val;
      this.urlSearch = `${this.url}${this.searchKey}`;
      window.location = this.urlSearch;
    },
    handleSubmit() {
      if (!this.searchKey) return alert("请输入关键字搜索");
      window.location = this.urlSearch;
    },
    handleClickIcon() {
      this.isShow = true;
      this.isShowHistory = false;
    },
    handleClick() {
      this.isShow = false;
    },
    handleBack(res) {
      console.log(res);
    },
    handleSugSearch(val) {
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://suggestion.baidu.com/su?p=3&wd=" +
        val +
        "&ie=UTF-8&cb=window.baidu.sug";
      document.head.appendChild(script);
    },
    handleCB() {
      //定义回调函数
      var _this = this;
      window.baidu = {
        sug: function (res) {
          _this.relevantLists = res.s;
          if (!_this.relevantLists) {
            _this.isShowHistory = false;
          } else {
            _this.isShowHistory = true;
          }
        },
      };
    },
    handleKeydown(keyCode) {
      if (keyCode === 13) {
        // enter键
        this.handleSubmit(); //方法
      }
    },
  },
  mounted() {
    var _this = this;
    this.cureentEngine = localStorage.SEARCH_ENGINE
      ? JSON.parse(localStorage.SEARCH_ENGINE)
      : this.engineLists[0];
    this.url = this.cureentEngine.url || this.engineLists[0].url;
    document.onkeydown = function () {
      let keyCode = window.event.keyCode;
      _this.handleKeydown(keyCode);
    };
    this.handleCB();
    window.onbeforeunload = function () {
      _this.searchKey = "";
    };
  },
});
