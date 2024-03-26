import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body
    console.log("Registrando Usuario");
    console.log(req.body);

    const exists = await userModel.findOne({ email })
    if (exists) {
        return res.status(402).send({ status: "error", message: "Usuario ya existe!!" })
    }
    const user = {
        first_name,
        last_name,
        email,
        age,
        password 
    }
    const result = await userModel.create(user);
    res.send({ status: "success", message: "Usuario creado con extito con ID: " + result.id });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    let username = 'Usuario'; 
    let age = null; 
    let admin = 'Usuario'; 

    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        username = 'Administrador';
        age = 77;
        admin = 'Admin';

        req.session.user = {
            name: username,
            email: email,
            age: age,
            admin: admin
        };

    } else {
        const user = await userModel.findOne({ email, password });
        if (!user) {
            console.log("Credenciales incorrectas");
            return res.status(401).send({ status: "error", error: "Credenciales incorrectas" });
        }

        req.session.user = {        
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            admin: admin
        };
        
    }   

    res.send({ status: "success", payload: req.session.user, message: "Primer logueo realizado!!!" });
});

export default router;