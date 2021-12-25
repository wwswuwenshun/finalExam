
// 路由模块
const express = require("express");
var formidable = require("formidable");
var Score = require("../models/score"); //导入模型类

// 调用路由方法，获取路由对象
var router = express.Router();
var responseData; //定义全局变量
//统一返回前端数据格式
router.use((req, res, next) => {
  responseData = {
    status: 200,
    data: [],
    message: "success",
  };
  next();
});
//加载首页
router.get("/", (req, res) => {
  console.log("根路径:", req.query);
  res.render("index.html"); //打开首页
});

// 请求所有信息数据
router.get("/user/query", async (req, res) => {
  // console.log("数据:", result);
  let Sno = parseInt(req.query.Sno) || null;
  let Sname = req.query.Sname || null;
  console.log(req.query);

  if (Sno) {
    // 精确查询
    console.log("Sno:", Sno);
    let userInfo = await Score.findOne({ Sno: Sno });
    if (userInfo) {
      console.log(userInfo);
      responseData.message = "查询成功!";
      responseData.data.push(userInfo);
      res.json(responseData);
    } else {
      responseData.status = 500;
      responseData.message = "用户不存在!";
      res.json(responseData);
    }
  } else if (Sname) {
    // 模糊查询
    console.log("Sname:", Sname);
    let users = await Score.find({ Sname: new RegExp(Sname) });
    console.log("111:", users);
    if (users.length) {
      responseData.message = "查询成功!";
      responseData.data = users;
      res.json(responseData);
    } else {
      responseData.message = "用户不存在!";
      responseData.status = 500;
      res.json(responseData);
    }
  } else {
    //  查询所有
    console.log("查询所有!");
    let result = await Score.find();
    // console.log("数据:", result);
    responseData.data = result;
    res.json(responseData);
  }
});

//添加信息(前端利用fromData数据打包发送过来)
router.post("/user/create", (req, res) => {
  // 用来获取form-data对象，用于文件上传以及表单数据解析
  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    console.log("数据:", fields);
    let Sno = fields.Sno || null;
    let Sname = fields.Sname || null;
    if (!Sno) {
      responseData.status = 500;
      responseData.message = "学号不能为空!";
      res.json(responseData);
      return;
    } else if (!Sname) {
      responseData.status = 500;
      responseData.message = "姓名不能为空!";
      res.json(responseData);
      return;
    }
    let userInfo = await Score.findOne({ Sno: Sno });
    console.log("结果:", userInfo);
    if (userInfo) {
      responseData.message = "用户已存在!";
      responseData.status = 500;
      res.json(responseData);
    } else {
      let result = await new Score(fields).save();
      console.log(result);
      if (result) {
        responseData.message = "添加成功!";
        res.json(responseData);
      }
    }
  });
});
//修改信息
router.post("/user/update", async (req, res) => {
  // console.log(req.body); //打印前端所请求的路径
  let data = {
    Sno: parseInt(req.body.Sno) || null,
    Sname: req.body.Sname,
    machine_learning: parseInt(req.body.machine_learning) || null,
    nodejs: parseInt(req.body.nodejs) || null,
    microservice: parseInt(req.body.microservice) || null,
    rstudio: parseInt(req.body.rstudio) || null,
    system_safety: parseInt(req.body.system_safety) || null,
  };
  let id = req.body._id || null;
  try {
    var result = await Score.updateOne({ _id: id }, data);
    // console.log("111:", result);
    if (result.nModified === 1) {
      responseData.message = "修改成功!";
    } else {
      responseData.status = 500;
      responseData.message = "修改失败!";
    }
  } catch (err) {
    responseData.status = 500;
    responseData.message = "操作异常!";
  }
  res.json(responseData);
});

//删除信息
router.get("/user/delete", async (req, res) => {
  // 解析前端url为一个对象，对象中有请求路径及参数
  console.log(req.query); //打印前端请求路径
  let Sno = parseInt(req.query.Sno) || null;
  console.log(typeof Sno);
  let result = await Score.deleteOne({ Sno: Sno });
  console.log(result);
  if (result.n === 1) {
    responseData.message = "删除成功!";
  } else {
    responseData.status = 500;
    responseData.message = "删除失败,用户不存在!";
  }
  res.json(responseData);
});
// 导出路由
module.exports = router;
