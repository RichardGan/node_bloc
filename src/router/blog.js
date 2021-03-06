const { SuccessModel, ErrorModel } = require("../model/resModel");
const {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog,
} = require("../controller/blog");
const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id;
  //获取博客列表
  if (method === "GET" && req.path === "/api/blog/list") {
    const author = req.query.author || "";
    const keyword = req.query.keyword || "";
    // const listData = getList(author, keyword);
    // return new SuccessModel(listData);
    const result = getList(author, keyword);
    return result.then((listData) => {
      return new SuccessModel(listData);
    });
  }

  //获取博客详情
  if (method === "GET" && req.path === "/api/blog/detail") {
    // const data = getDetail(id);
    // return new SuccessModel(data);
    const result = getDetail(id);
    return result.then((data) => {
      return new SuccessModel(data);
    });
  }

  //新建一篇博客
  if (method === "POST" && req.path === "/api/blog/new") {
    // const data = newBlog(req.body);
    // return new SuccessModel(data);
    req.body.author = "zhangsan"; //假数据，待开发登录时再改
    const result = newBlog(req.body);
    return result.then((data) => {
      return new SuccessModel(data);
    });
  }

  //更新一篇博客
  if (method === "POST" && req.path === "/api/blog/update") {
    const result = updataBlog(id, req.body);
    return result.then((val) => {
      if (val) {
        return new SuccessModel();
      } else {
        return new ErrorModel("更新博客失败");
      }
    });
    // if (result) {
    //   return new SuccessModel();
    // } else {
    //   return new ErrorModel("更新博客失败");
    // }
  }

  //删除一篇博客
  if (method === "POST" && req.path === "/api/blog/del") {
    const author = "zhangsan"; //假数据，待开发登录时再改
    const result = delBlog(id, author);
    return result.then((val) => {
      if (result) {
        return new SuccessModel();
      } else {
        return new ErrorModel("删除博客失败");
      }
    });
    // if (result) {
    //   return new SuccessModel();
    // } else {
    //   return new ErrorModel("删除博客失败");
    // }
  }
};

module.exports = handleBlogRouter;
