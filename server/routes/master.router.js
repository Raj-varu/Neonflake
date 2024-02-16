const express = require("express");
const router = express.Router();
const pikwyService = require("../controller/pikwy.service");

router.post("/generate", pikwyService);

module.exports = router;
