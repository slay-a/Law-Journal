import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import APIClient from "../../../APIClient";
import Cookies from "js-cookie";

const QuizApp = () => {
  const [chapters, setChapters] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [chapterFilter, setChapterFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [showAnswers, setShowAnswers] = useState({});
  const [allAnswersShown, setAllAnswersShown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  const [previousAttempt, setPreviousAttempt] = useState(null);
  const [showIncorrectQuestions, setShowIncorrectQuestions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwt_token = Cookies.get("jwt_token");
        const questionsRes = await APIClient.get("/questions/data", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
              });
        const q = questionsRes.data.questions || [];

        setQuestions(q);

        const uniqueChapters = [...new Set(q.map(question => question.chapter))];
        setChapters(uniqueChapters);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = questions;
    if (chapterFilter) {
      result = result.filter(q => q.chapter === chapterFilter);
    } else {
      result = [];
    }

    if (difficultyFilter) {
      result = result.filter(q => q.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
    }

    setFilteredQuestions(result);
  }, [questions, chapterFilter, difficultyFilter]);

  // Fetch previous attempt when chapter or difficulty changes
  useEffect(() => {
    const fetchPreviousAttempt = async () => {
      if (!chapterFilter) {
        setPreviousAttempt(null);
        return;
      }
      const difficultyToStore = difficultyFilter === "" ? "all" : difficultyFilter;
      try {
        const jwt_token = Cookies.get("jwt_token");
        const res = await APIClient.get(
          `/quizresults?chapter=${encodeURIComponent(chapterFilter)}&difficulty=${encodeURIComponent(difficultyToStore)}`,
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        if (res.data.success && res.data.attempt) {
          setPreviousAttempt(res.data.attempt);
        } else {
          setPreviousAttempt(null);
        }
      } catch (error) {
        console.error("Error fetching previous attempt:", error);
        setPreviousAttempt(null);
      }
    };

    fetchPreviousAttempt();
    setSubmitted(false);
    setScore(null);
    setUserAnswers({});
    setShowAnswers({});
    setAllAnswersShown(false);
    setShowIncorrectQuestions(false);
  }, [chapterFilter, difficultyFilter]);

  const handleShowAnswer = (index) => {
    setShowAnswers((prev) => ({ ...prev, [index]: true }));
  };

  const handleOptionChange = (questionIndex, optionLetter) => {
    setUserAnswers(prev => ({...prev, [questionIndex]: optionLetter}));
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    let incorrectQuestions = [];

    filteredQuestions.forEach((question, i) => {
      const userAnswer = userAnswers[i];
      
      // Construct options array
      const options = [question.option_a, question.option_b];
      if (question.option_c) options.push(question.option_c);
      if (question.option_d) options.push(question.option_d);

      // Derive indices
      const userAnswerIndex = userAnswer ? userAnswer.charCodeAt(0) - 65 : null;
      const correctAnswerIndex = question.correct_answer.charCodeAt(0) - 65;

      const userAnswerText = userAnswerIndex !== null ? options[userAnswerIndex] : "No Answer";
      const correctAnswerText = options[correctAnswerIndex];

      if (userAnswer === question.correct_answer) {
        correctCount++;
      } else {
        // record incorrect question with full details
        incorrectQuestions.push({
          question_text: question.question_text,
          user_answer: userAnswerText,
          correct_answer: correctAnswerText,
          explanation: question.explanation || ""
        });
      }
    });

    setScore(correctCount);
    setSubmitted(true);

    const difficultyToStore = difficultyFilter === "" ? "all" : difficultyFilter;

    // POST score, chapter, difficulty, incorrect_questions
    try {
      const jwt_token = Cookies.get("jwt_token");
      await APIClient.post("/save/quizresult", 
        {
          chapter: chapterFilter,
          difficulty: difficultyToStore,
          score: correctCount,
          incorrect_questions: incorrectQuestions
        },
        {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        }      );
      console.log("Score saved successfully");
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const handleShowAllAnswers = () => {
    const allShown = {};
    filteredQuestions.forEach((q, i) => {
      allShown[i] = true;
    });
    setShowAnswers(allShown);
    setAllAnswersShown(true);
  };

  return (
    <Grid container spacing={3} style={{ padding: "20px" }}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          Quiz Questions
        </Typography>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper style={{ padding: 20, marginBottom: 20 }}>
          <Typography variant="h6" gutterBottom>Filter by Chapter</Typography>
          <FormControl fullWidth>
            <InputLabel>Chapter</InputLabel>
            <Select
              value={chapterFilter}
              label="Chapter"
              onChange={(e) => setChapterFilter(e.target.value)}
            >
              <MenuItem value="">Select a chapter</MenuItem>
              {chapters.map((ch, idx) => (
                <MenuItem key={idx} value={ch}>{ch}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {chapterFilter && (
          <Paper style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h6" gutterBottom>Filter by Difficulty</Typography>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficultyFilter}
                label="Difficulty"
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Sample">Sample</MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        )}

        {chapterFilter && previousAttempt && (
          <Paper style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h6" gutterBottom>Previous Attempt</Typography>
            <Typography variant="body1">Score: {previousAttempt.score}</Typography>
            {previousAttempt.incorrect_questions && previousAttempt.incorrect_questions.length > 0 && !showIncorrectQuestions && (
              <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: '10px' }}
                onClick={() => setShowIncorrectQuestions(true)}
              >
                Show Incorrect Questions
              </Button>
            )}
          </Paper>
        )}

        {submitted && (
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">Your Score: {score}/{filteredQuestions.length}</Typography>
            {!allAnswersShown && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleShowAllAnswers}
                style={{ marginTop: '10px' }}
              >
                Show All Answers
              </Button>
            )}
          </Paper>
        )}
      </Grid>

      <Grid item xs={12} md={8}>
        {showIncorrectQuestions && previousAttempt && previousAttempt.incorrect_questions && previousAttempt.incorrect_questions.length > 0 ? (
          <>
            {previousAttempt.incorrect_questions.map((iq, index) => (
              <Paper key={index} style={{ padding: 20, marginBottom: 20 }}>
                <Typography variant="h6">Incorrect Question {index + 1}:</Typography>
                <Typography variant="body1">Question: {iq.question_text}</Typography>
                <Typography variant="body1">Your Answer: {iq.user_answer}</Typography>
                <Typography variant="body1">Correct Answer: {iq.correct_answer}</Typography>
                {iq.explanation && iq.explanation.trim() !== "" && (
                  <Typography variant="body1">Explanation: {iq.explanation}</Typography>
                )}
              </Paper>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowIncorrectQuestions(false)}
              style={{ marginTop: '20px' }}
            >
              Take me back to quiz
            </Button>
          </>
        ) : (
          <>
            {filteredQuestions.length > 0 ? (
              <>
                {filteredQuestions.map((question, index) => {
                  const isAnswerShown = showAnswers[index];
                  const correctAnswer = question.correct_answer; 
                  const explanation = question.explanation || "";
                  const chapter = question.chapter || "";

                  const options = [question.option_a, question.option_b];
                  if (question.option_c) options.push(question.option_c);
                  if (question.option_d) options.push(question.option_d);

                  return (
                    <Paper key={index} style={{ padding: 20, marginBottom: 20 }}>
                      <Typography variant="h6" gutterBottom>
                        Chapter: {chapter}
                      </Typography>
                      <Typography variant="h6">Q{index + 1}: {question.question_text}</Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        Difficulty: {question.difficulty}
                      </Typography>

                      <FormControl component="fieldset">
                        <RadioGroup
                          value={userAnswers[index] || ""}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        >
                          {options.map((option, i) => {
                            const optionLetter = String.fromCharCode(65 + i); // 'A', 'B', 'C', 'D'
                            const isCorrect = isAnswerShown && optionLetter === correctAnswer;

                            return (
                              <FormControlLabel
                                key={i}
                                value={optionLetter}
                                control={<Radio />}
                                label={option}
                                style={{
                                  backgroundColor: isCorrect ? "lightgreen" : "transparent"
                                }}
                                disabled={submitted}
                              />
                            );
                          })}
                        </RadioGroup>
                      </FormControl>

                      {submitted && !allAnswersShown && !isAnswerShown && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleShowAnswer(index)}
                          style={{ marginTop: '10px' }}
                        >
                          Show Answer
                        </Button>
                      )}

                      {isAnswerShown && (
                        <Typography variant="body2" style={{ marginTop: '10px' }}>
                          <strong>Correct Answer:</strong> {correctAnswer}<br />
                          <strong>Explanation:</strong> {explanation}
                        </Typography>
                      )}
                    </Paper>
                  );
                })}

                {!submitted && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    style={{ marginTop: '20px' }}
                  >
                    Submit
                  </Button>
                )}
              </>
            ) : (
              chapterFilter ? (
                <Typography variant="body2">
                  No questions found for this chapter and/or difficulty.
                </Typography>
              ) : (
                <Typography variant="body2">
                  Please select a chapter to view questions.
                </Typography>
              )
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default QuizApp;