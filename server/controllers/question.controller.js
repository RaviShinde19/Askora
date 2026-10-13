import { Question } from "../models/question.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createQuestion = asyncHandler(async (req,res) => {
    const { title, description, tags } = req.body;

    if (!title || !description || !Array.isArray(tags) || tags.length === 0) {
    throw new ApiError(400, "All fields (title, description, tags) are required");
    }

    const question = await Question.create({
    title,
    description,
    tags,
    askedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, question, "Question created successfully"));
})

const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find().populate('askedBy', 'username email') 
    .populate({
        path: "answers",
    //     populate: {
    //     path: "answeredBy", 
    //     select: "username email",
    //   },
    });

  return res
    .status(200)
    .json(new ApiResponse(200, questions, "All questions fetched successfully"));
});

//Get question By ID
export const getQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.questionId)
    .populate("askedBy", "username email profilePicUrl")
    .populate({
      path: "answers",
      populate: {
        path: "author",
        select: "username profilePicUrl"
      }
    });

  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  question.views = (question.views || 0) + 1;
  await question.save();

  res.status(200).json({
    statusCode: 200,
    data: question,
    message: "Question fetched successfully",
    success: true
  });
});

export const getQuestions = asyncHandler(async (req, res) => {
  const { search, sortBy, filterBy } = req.query;
  
  let query = {};
  
  // Search functionality
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } }
    ];
  }
  
  // Filter functionality
  if (filterBy === "answered") {
    query.answers = { $exists: true, $not: { $size: 0 } };
  } else if (filterBy === "unanswered") {
    query.$or = [
      { answers: { $exists: false } },
      { answers: { $size: 0 } }
    ];
  }
  
  // Sort functionality
  let sort = {};
  switch (sortBy) {
    case "oldest":
      sort.createdAt = 1;
      break;
    case "votes":
      sort.upvotes = -1;
      break;
    case "views":
      sort.views = -1;
      break;
    default: // 'newest' or default
      sort.createdAt = -1;
  }
  
  const questions = await Question.find(query)
    .sort(sort)
    .populate("askedBy", "username profilePicUrl")
    .lean();

  res.status(200).json({
    statusCode: 200,
    data: questions,
    message: "Questions fetched successfully",
    success: true
  });
});


export {
    createQuestion,
    getAllQuestions
}