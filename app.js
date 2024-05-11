const express = require("express");
const app = express();
const port = 3000;

// Set the json request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
 const supplierRouter = require("./src/routes/index");

app.use("/v1", supplierRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
