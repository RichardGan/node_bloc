const redis = require("redis");
const { REDIS_CONF } = require("../conf/db");

//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on("error", (err) => {
  console.error(err);
});

function set(key, val) {
  if (typeof val === "object") {
    val = JSON.stringify(val);
  }
  redisClient.set(key, val, redis.prit);
}

function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, val) => {
      if (err) {
        console.error(err);
        return;
      }
      if(val==null){
          resolve(null)
          return
      }
      //为了转换成JSON对象
      try {
          resolve(
              JSON.parse(val)
          )
      } catch (ex) {
        resolve(val)
      }
    });
  });
  return promise;
}

module.exports = {
  set,
  get,
};
