const service = require("./posts.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function postExists(req, res, next) {
  const { postId } = req.params;

  const post = await service.read(postId);
  if (post) {
    res.locals.post = post;
    return next();
  }
  return next({ status: 404, message: `Post cannot be found.` });
}

async function read(req, res, next){
  const { postId } = req.params;
  const post = await service.read(postId);
  res.json( { data: post })
}

async function create(req, res) {
  const post = await service.create(req.body.data);
  res.status(201).json({ data: post})
}

async function update(req, res) {

    const updatedPost = {
      post_body: req.body.data.post_body,
      post_id: res.locals.post.post_id, 
      post_title: req.body.data.post_title
    }; 

    const data = await service.update(updatedPost);
    const returnedPost = { post_body: data[0].post_body, 
      post_id: data[0].post_id,
      post_title: data[0].post_title
    }
    res.json( { data: returnedPost}) 
}


async function destroy(req, res) {
  const post = res.locals.post;
  const post_id = post["post_id"]
  const result = await service.delete(post_id);
  res.sendStatus(204)
}

module.exports = {
  read: asyncErrorBoundary(read),
  create: asyncErrorBoundary(create),
  update: [asyncErrorBoundary(postExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(postExists), asyncErrorBoundary(destroy)],
};
