const knex = require("../db/connection");

function list() {
  return knex("comments")
    .select("*");
};

function listCommenterCount() {
 
  return knex("comments as c")
  .join("users as u","c.commenter_id","u.user_id") 
  .count("u.user_email as count")
  .select("u.user_email as commenter_email")
  .groupBy("u.user_email")
  .orderBy("u.user_email")

};

function read(comment_id) {
  return knex("comments as c")
  .join("users as u", "c.commenter_id", "u.user_id")
  .join("posts as p", "c.post_id","p.post_id")
  .select("c.comment_id","c.comment","u.user_email as commenter_email","p.post_body as commented_post")
  .where({comment_id})
  .first();
};

module.exports = {
  list,
  listCommenterCount,
  read,
};
