// 服务器模块
const express = require("express");
const app = express();
const mongoose = require("mongoose"); //加载数据库模块
var bodyParser = require("body-parser"); //加载body-parser处理post提交的数据
const path = require("path");
cp = require("child_process"); // 可自动打开浏览器模块

app.use(require("cors")()); //解决拦截跨源请求问题

// 引入模板引擎，设置模板引擎加载资源的后缀名
app.use(express.static(__dirname+"/views",{index:"login.html"}))//默认首页
app.use(express.static(path.join(__dirname, "public"))); //将静态资源放在public目录
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views")); //将前端页面放在views目录
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// 导入外置路由
var router = require("./routes/router");
// 引用外置路由
app.use(router);
// 连接数据库
mongoose.connect(
  'mongodb://172.21.2.236:27017/190110910821',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("数据库连接失败");
    } else {
      app.listen(10821, function () {
        console.log("服务器启动成功，请访问：http://localhost:10821/");
        cp.exec("start http://localhost:10821/");
      });
    }
  }
);
