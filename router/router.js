const express = require("express");
const router = express.Router();
// controller path
const controller = require("../controller/controller");

router.get("/home", controller.home);

// signup routes
router.post("/signup", controller.signup);

// login routes
router.post("/login", controller.login);

//course routes
router.get("/tutorial", requiredtoken, controller.tutorial);

// requiredtoken
function requiredtoken(req, res, next) {
  let headers = req.headers["token"];
  console.log(headers, "token##");
  if (typeof headers !== undefined && headers !== "") {
    req.token = headers;
    next();
  } else {
    res.send({
      status: false,
      msg: "token required ...",
    });
  }
}

module.exports = router;
