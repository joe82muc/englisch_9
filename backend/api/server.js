import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/hint", (req, res) => {

  const { studentAnswer, correctAnswer } = req.body;

  let hint = "Think about the correct tense.";

  if (!studentAnswer.includes("was") && !studentAnswer.includes("were")) {
    hint = "Do you need 'was' or 'were'?";
  }

  if (!studentAnswer.includes("ing")) {
    hint = "Remember the -ing form.";
  }

  res.json({ hint });

});

app.listen(3000, () => {
  console.log("Server running");
});
