const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const PORT = 3000;

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "b22d30aacf55bd",
  host: "us-cdbr-east-04.cleardb.com",
  password: "3e010520",
  database: "heroku_ecc22c45948cbfe",
});


app.post("/addpassword", (req, res) => {
  const { password, title } = req.body;
  const hashedPassword = encrypt(password);
  db.query(
    "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)",
    [hashedPassword.password, title, hashedPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Success");
      }
    }
  );
});

app.get("/showpasswords", (req, res) => {
  db.query("SELECT * FROM passwords;", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/decryptpassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
