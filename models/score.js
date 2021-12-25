var mongoose = require("mongoose");
// 用户的表结构对象
var scoreSchema = new mongoose.Schema({
  Sno: Number, //学号
  Sname: String, //姓名
  Password: Number, //密码
  machine_learning: Number, //机器学习
  nodejs: Number, //大前端
  microservice: Number, //微服务
  rstudio: Number, //数据可视化
  system_safety: Number, //软件安全
});
// 创建模型类并导出
module.exports = mongoose.model("Score", scoreSchema);
