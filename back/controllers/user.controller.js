const UserModel = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (data, callback) => {
    try {
        const { pseudo, email, password } = data;
        console.log(data);

        const existingUser = await UserModel.findOne({ $or: [{ pseudo }, { email }] });
        if (existingUser) {
            return callback({ success: false, error: "pseudo déjà pris" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new UserModel({
            pseudo,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        callback({ success: true, message: 'Inscription réussie' });
    } catch (error) {
        console.error("Erreur lors de l'inscription : ", error);
        callback({
            success: false, error: "Erreur lors de l'inscription "
        })
    }
};


exports.loginUser = async (data, callback) => {
    try {
        const { pseudo, email, password } = data;
        console.log(data);
        const user = await UserModel.findOne({ $and: [{ pseudo }, { email }] });
        console.log(user);
        if (!user) {
            return callback({ success: false, error: 'Identifiants incorrects, veuillez les vérifiés' + pseudo });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return callback({ success: false, error: 'Identifiants incorrects, veuillez les vérifiés' + pseudo });
        }
        const token = jwt.sign(
            { userId: user._id, pseudo: user.pseudo, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '12h' }
        );
        const loginData = {
            id: user._id,
            pseudo: user.pseudo,
            email: user.email,
            token: token
        };

        callback({ success: true, message: 'Connexion réussie', loginData });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return callback({ success: false, error: 'Erreur lors de la connexion' });
    }
};