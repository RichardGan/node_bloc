const { exec } = require("../db/mysql");

const getList = (author, keyword) => {
  //1=1 保底
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}'`;
  }
  if (keyword) {
    sql += `and title like '%${keyword}%'`;
  }
  sql += `order by createtime desc;`;

  //返回promise
  // console.log(sql)
  return exec(sql);

  // // 先返回加数据（格式正确）
  // return [
  //   {
  //     id: 1,
  //     title: "标题A",
  //     content: "内容A",
  //     createTime: 1604850544775,
  //     author: "zhangsan",
  //   },
  //   {
  //     id: 2,
  //     title: "标题B",
  //     content: "内容B",
  //     createTime: 1604850600908,
  //     author: "lisi",
  //   },
  // ];
};

const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`;
  return exec(sql).then((rows) => {
    return rows[0];
  });

  // return {
  //   id: 1,
  //   title: "标题A",
  //   content: "内容A",
  //   createTime: 1604850544775,
  //   author: "zhangsan",
  // };
};

const newBlog = (blogData = {}) => {
  // return {
  //   id: 3, //新建博客，插入到数据表里面的 id
  // };
  const { title, content, author } = blogData;
  const createTime = Date.now();

  const sql = `
    insert into blogs (title, content, createtime, author)
    value ('${title}','${content}','${createTime}','${author}');
  `;
  return exec(sql).then((insertData) => {
    console.log("inserData is", insertData);
    return {
      id: insertData.insertId,
    };
  });
};

const updataBlog = (id, blogData = {}) => {
  const title = blogData.title;
  const content = blogData.content;

  const sql = `
    update blogs set title='${title}', content='${content}' where id=${id}
  `;
  return exec(sql).then((updateData) => {
    console.log("updateDate is ", updateData);
    if (updateData.affectedRows > 0) {
      return true;
    }
    return false;
  });

  // return true;
};

const delBlog = (id, author) => {
  // return true;
  const sql = `
    delete from blogs where id='${id}' and author='${author}';
  `;
  return exec(sql).then((delData) => {
    console.log("updateDate is ", delData);
    if (delData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updataBlog,
  delBlog,
};
