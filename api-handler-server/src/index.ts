import express from "express";
import cors from "cors";
import dotevn from "dotenv";

dotevn.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", () => {
  // SPIN THE DOCKER CONTAINER FROM AWS ECS AND ECR
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Api Handler Server started at port: ${port}`);
});
