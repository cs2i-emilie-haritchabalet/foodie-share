import express from "express";
import cors from "cors";
import routes from "./routes";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use("/foodie-share", routes);

export default app;

// commentaire pour test push