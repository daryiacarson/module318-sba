const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const error = require("../utilities/error");

// Placeholder for comments data
//const comments = [];

// GET /comments
router.get("/", (req, res) => {
  // Placeholder route, no comments data yet
  res.json({ comments });
});

// POST /comments
router.post("/", (req, res, next) => {
  // Extract data from request body
  const { userId, postId, body } = req.body;

  // Validate required fields
  if (!userId || !postId || !body) {
    return next(error(400, "Insufficient Data"));
  }

  // Create new comment object
  const comment = {
    id: comments.length + 1,
    userId,
    postId,
    body,
  };

  // Add comment to the comments array
  comments.push(comment);

  // Respond with the newly created comment
  res.status(201).json(comment);
});

router.get("/:id", (req, res) => {
  // Extract comment ID from request parameters
  const commentId = req.params.id;

  // Find the comment with the specified ID
  const comment = comments.find((comment) => comment.id === parseInt(commentId));

  // If comment is not found, return an error
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  // Return the comment
  res.json({ comment });
});

router.patch("/:id", (req, res) => {
  // Extract comment ID from request parameters
  const commentId = req.params.id;

  // Find the index of the comment with the specified ID
  const commentIndex = comments.findIndex((comment) => comment.id === parseInt(commentId));

  // If comment is not found, return an error
  if (commentIndex === -1) {
    return res.status(404).json({ error: "Comment not found" });
  }

  // Update the body of the comment with the new body from request body
  comments[commentIndex].body = req.body.body;

  // Return the updated comment
  res.json({ updatedComment: comments[commentIndex] });
});

router.delete("/:id", (req, res) => {
  // Extract comment ID from request parameters
  const commentId = req.params.id;

  // Find the index of the comment with the specified ID
  const commentIndex = comments.findIndex((comment) => comment.id === parseInt(commentId));

  // If comment is not found, return an error
  if (commentIndex === -1) {
    return res.status(404).json({ error: "Comment not found" });
  }

  // Remove the comment from the comments array
  comments.splice(commentIndex, 1);

  // Return success message
  res.json({ message: "Comment deleted successfully" });
});

router.get("/", (req, res) => {
  // Extract userId and postId from query parameters
  const { userId, postId } = req.query;

  // Filter comments based on query parameters
  let filteredComments = comments;
  if (userId) {
    filteredComments = filteredComments.filter((comment) => comment.userId === userId);
  }
  if (postId) {
    filteredComments = filteredComments.filter((comment) => comment.postId === postId);
  }

  // Return the filtered comments
  res.json({ comments: filteredComments });
});

// Define route to retrieve comments by postId route parameter
router.get("/posts/:id/comments", (req, res) => {
  // Extract postId from route parameters
  const postId = req.params.id;

  // Filter comments based on postId
  const postComments = comments.filter((comment) => comment.postId === postId);

  // Return the comments made on the post with the specified id
  res.json({ comments: postComments });
});

// Define route to retrieve comments by userId route parameter
router.get("/users/:id/comments", (req, res) => {
  // Extract userId from route parameters
  const userId = req.params.id;

  // Filter comments based on userId
  const userComments = comments.filter((comment) => comment.userId === userId);

  // Return the comments made by the user with the specified id
  res.json({ comments: userComments });
});

// Define route to retrieve comments by postId and userId query parameters
router.get("/posts/:id/comments", (req, res) => {
  // Extract postId and userId from route parameters and query parameters
  const { id: postId } = req.params;
  const { userId } = req.query;

  // Filter comments based on postId and userId
  let filteredComments = comments.filter((comment) => comment.postId === postId);
  if (userId) {
    filteredComments = filteredComments.filter((comment) => comment.userId === userId);
  }

  // Return the comments made on the post with the specified id by the user with the specified userId
  res.json({ comments: filteredComments });
});

// Define route to retrieve comments by userId and postId query parameters
router.get("/users/:id/comments", (req, res) => {
  // Extract userId and postId from route parameters and query parameters
  const { id: userId } = req.params;
  const { postId } = req.query;

  // Filter comments based on userId and postId
  let filteredComments = comments.filter((comment) => comment.userId === userId);
  if (postId) {
    filteredComments = filteredComments.filter((comment) => comment.postId === postId);
  }

  // Return the comments made by the user with the specified id on the post with the specified postId
  res.json({ comments: filteredComments });
});

module.exports = router;