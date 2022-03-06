const db = require("../dbconnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.home = (req, res) => {
  res.send("api working here ...");
};

// signup
module.exports.signup = async (req, res) => {
  console.log(req.body, "data##");
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  // first check email id already exit
  let emailchkqry = `select email from users where email = '${email}' `;
  db.query(emailchkqry, async (err, result) => {
    if (err) throw err;
    // check email id already exits
    if (result.length > 0) {
      res.send({
        status: false,
        msg: "email id already exits",
      });
    } else {
      // password decrypt
      decryptpwd = await bcrypt.hash(password, 10);
      // insert data
      let insertqry = `insert into users(name,email,password) values('${name}','${email}','${decryptpwd}') `;
      db.query(insertqry, (err, result) => {
        if (err) throw err;
        res.send({
          status: true,
          msg: "user register successful",
        });
      });
    }
  });
};

// login

module.exports.login = (req, res) => {
  console.log(req.body, "login");
  let email = req.body.email;
  let password = req.body.password;

  // checkemailid
  let chkemailid = `select * from users where email = '${email}'`;
  db.query(chkemailid, async (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      let data = {
        name: result[0].name,
        email: result[0].email,
      };
      //    check password
      let chkpwd = await bcrypt.compare(password, result[0].password);
      console.log(chkpwd, "chkpwd##");
      if (chkpwd === true) {
        const token = jwt.sign({ data }, "privatkey");
        console.log(token, "token##");
        res.send({
          status: true,
          token: token,
          result: data,
          msg: "user login successful",
        });
      } else {
        res.send({
          status: false,
          msg: "invalid user",
        });
      }
    } else {
      res.send({
        status: false,
        msg: "invalid email id",
      });
    }
  });
};

// course

module.exports.tutorial = (req, res) => {
  // check verifyToken
  let chkToken = verifyToken(req.token);

  if (chkToken.status == true) {
    let tutorialqry = `select * from tutorial`;
    db.query(tutorialqry, (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        res.send({
          status: true,
          data: result,
        });
      } else {
        res.send({
          status: false,
          msg: "data not found",
        });
      }
    });
  } else {
    res.send({
      status: false,
      msg: "token invalid",
    });
  }
};

//verifytokens
function verifyToken(token) {
  return jwt.verify(token, "privatkey", (err, result) => {
    if (err) {
      let a = { status: false };
      return a;
    } else {
      let b = { status: true };
      return b;
    }
  });
}
