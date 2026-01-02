const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("admin"));

// 🔴 WRITE YOUR CODE HERE ⬇⬇⬇
app.get("/homepage" , (req, res) =>{
  res.render("./public/index.html");
})
app.post("/update-public-theme", (req, res) => {
  const { primary, secondary } = req.body;

  if (!primary || !secondary) {
    return res.status(400).send("Missing colors");
  }

  const css = `
:root {
  --primary: ${primary};
  --primary-dark: ${primary};
  --secondary: ${secondary};
}
`;

  fs.writeFileSync(
    path.join(__dirname, "public/public-theme.css"),
    css
  );

  res.sendStatus(200);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
