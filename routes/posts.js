const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const error = require("../utilities/error");

// GET /api/posts?userId=<VALUE>
router.get("/user", (req, res) => {
  // Extract userId from query parameter
  const userId = req.query.userId;
  console.log("userId : " + userId);
  // If userId not provided, send 400 error
  if (!userId) return next(error(400, "userId parameter is required"));

  // Filter posts by userId
  const userPosts = posts.filter((post) => post.userId == userId);

  // Respond with filtered posts
  // if (userPosts) res.json({ userPosts });
  // else next("/");
  // If no posts are found for the user, return a message
  if (userPosts.length === 0) {
    return res.json({ message: "No posts found for the specified userId." });
  }

  // Return the posts associated with the userId
  res.json({ userId: userId, posts: userPosts });
});

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];
    console.log("get method post")
    res.json({ posts, links });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);

    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

module.exports = router;