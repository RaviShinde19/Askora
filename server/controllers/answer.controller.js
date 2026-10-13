import { Answer } from "../models/answer.models.js";
import { Question } from "../models/question.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createAnswer = asyncHandler(async (req, res) => {
  const { content, questionId } = req.body;

  if (!content || !questionId) {
    res.status(400);
    throw new Error("Please provide content and question ID");
  }

  // Check if question exists
  const question = await Question.findById(questionId);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  const answer = await Answer.create({
    content,
    question: questionId,
    author: req.user._id
  });

  // Add answer to question's answers array
  question.answers.push(answer._id);
  await question.save();

  res.status(201).json({
    statusCode: 201,
    data: answer,
    message: "Answer created successfully",
    success: true
  });
});

export const getAnswers = asyncHandler(async (req, res) => {
  const answers = await Answer.find({ question: req.params.questionId })
    .populate("author", "username profilePicUrl")
    .sort({ createdAt: -1 });

  res.status(200).json({
    statusCode: 200,
    data: answers,
    message: "Answers fetched successfully",
    success: true
  });
});

export const voteAnswer = asyncHandler(async (req, res) => {
  const { voteType } = req.body; // 'upvote' or 'downvote'
  const answer = await Answer.findById(req.params.answerId);

  if (!answer) {
    res.status(404);
    throw new Error("Answer not found");
  }

  const userId = req.user._id;

  // Check if user already voted
  const hasUpvoted = answer.upvotes.includes(userId);
  const hasDownvoted = answer.downvotes.includes(userId);

  if (voteType === "upvote") {
    if (hasUpvoted) {
      // Remove upvote
      answer.upvotes.pull(userId);
    } else {
      // Add upvote and remove downvote if exists
      answer.upvotes.push(userId);
      if (hasDownvoted) answer.downvotes.pull(userId);
    }
  } else if (voteType === "downvote") {
    if (hasDownvoted) {
      // Remove downvote
      answer.downvotes.pull(userId);
    } else {
      // Add downvote and remove upvote if exists
      answer.downvotes.push(userId);
      if (hasUpvoted) answer.upvotes.pull(userId);
    }
  } else {
    res.status(400);
    throw new Error("Invalid vote type");
  }

  answer.votes = answer.upvotes.length - answer.downvotes.length;
  await answer.save();

  res.status(200).json({
    statusCode: 200,
    data: answer,
    message: "Vote recorded successfully",
    success: true
  });
});


export const acceptAnswer = asyncHandler(async (req, res) => {
  const answer = await Answer.findById(req.params.answerId)
    .populate("question");

  if (!answer) {
    res.status(404);
    throw new Error("Answer not found");
  }

  // Check if the requesting user is the question author
  if (answer.question.askedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to accept this answer");
  }

  // Unaccept any previously accepted answer for this question
  await Answer.updateMany(
    { question: answer.question._id, _id: { $ne: answer._id } },
    { $set: { isAccepted: false } }
  );

  // Accept this answer
  answer.isAccepted = true;
  await answer.save();

  res.status(200).json({
    statusCode: 200,
    data: answer,
    message: "Answer accepted successfully",
    success: true
  });
});


export {
    createAnswer,
    // getAnswers,
    // acceptAnswer,
    // voteAnswer
}