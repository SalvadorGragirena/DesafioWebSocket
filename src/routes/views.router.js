const express = require("express");
const router = express.Router(); 


const ProductManager = require('../ProductManager'); 

let manager = new ProductManager();

//Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/", async (req, res) => {
        res.render("home");
})

router.get("/realtimeproducts", async (req, res) => {
        res.render("realtimeproducts");
})


module.exports = router; 