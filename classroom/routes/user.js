const express = require("express");
const router = express.Router();

//Index route
router.get("/", (req, res) => {
    res.send("GET for users");
});

//show route
router.get("/:id", (req, res) => {
    res.send("GET for user id");
});

//POST users
router.post("/", (req, res) => {
    res.send("POST for users");
});

//DELETE - users
router.delete("/:id", (req, res) => {
    res.send("DELETE for users");
});


module.exports = router;