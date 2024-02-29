const express = require('express');
const router = express.Router();
const CarritoManager = require('../CarritoManager'); // Importa la clase

let manager = new CarritoManager();

//Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/', async (req, res) => {
    const result = await manager.showCarrito();
    res.send(result);
    console.log(result);
});

router.post("/", async (req, res) => {

    const result = await manager.addCarrito();
    res.send(result);

})


router.post("/:cid/product/:pid", async (req, res) => {

    const cid = req.params.cid;
    const pid = req.params.pid;
    console.log("CID:", cid);
    console.log("PID:", pid);
    const message = await manager.addProduct(cid, pid);
    res.send(message);

})


module.exports = router;
