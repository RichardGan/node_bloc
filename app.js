const querystring = require("querystring");
const handleUserRouter = require("./src/router/user");
const handleBlogRouter = require("./src/router/blog");

//获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  console.log("d.toGMTString() is", d.toGMTString());
  return d.toGMTString();
};
//session 数据
const SESSION_DATA = {};

//用于处理post data
const getPostData = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }
    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
};

const serverHandle = (req, res) => {
  //返回JSON格式
  res.setHeader("Content-type", "application/json");

  // 获取path
  const url = req.url;
  req.path = url.split("?")[0];

  //解析 query
  req.query = querystring.parse(url.split("?")[1]);

  //解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || ""; //k1=v1,k2=v2
  cookieStr.split(";").forEach((item) => {
    if (!item) {
      return;
    }
    const arr = item.split("=");
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });

  //解析session
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];

  //如果有post，就往req.body里面放数据
  getPostData(req).then((postData) => {
    req.body = postData;

    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then((blogData) => {
        if (needSetCookie) {
          //操作cookie,做限制
          res.setHeader(
            "Set-Cookie",
            `userid=${userId};path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        res.end(JSON.stringify(blogData));
      });
      return;
    }

    //处理user路由
    const userData = handleUserRouter(req, res);
    if (userData) {
      userData.then((userData) => {
        if (needSetCookie) {
          //操作cookie,做限制
          res.setHeader(
            "Set-Cookie",
            `userid=${userId};path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        res.end(JSON.stringify(userData));
      });
      return;
    }

    // 未命中路由，返回404
    res.writeHead(403, { "Content-type": "text/plain" });
    res.write("403 not found\n");
    res.end();
  });
};

module.exports = serverHandle;

//process.env.NODE_ENV
