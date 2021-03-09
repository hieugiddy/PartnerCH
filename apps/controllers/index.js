var express = require("express");
var router = express.Router();

router.use("/", require(__dirname + "/partner"));
router.use("/account", require(__dirname + "/account"));

module.exports = router;