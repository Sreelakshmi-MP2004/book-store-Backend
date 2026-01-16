const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// logic for register

exports.userRegister = async (req, res) => {
    console.log("Inside Register function");
    const { username, email, password } = req.body
    try {


        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(402).json("User alredy exist...")

        }
        else {
            const newUser = new User({ username, email, password })
            await newUser.save()
            res.status(200).json({ message: "Register Success", newUser })
        }
    } catch (err) {
        res.status(500).json(err)
    }

}

// logic for login

exports.userLogin = async (req, res) => {
    console.log("Inside Register function");
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                // token generation
                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.jwtKey)
                console.log(token);
                res.status(200).json({ message: "Login success", existingUser })
            }
            else {
                res.status(401).json("password Mismatch!");
            }
        }
        else {
            res.status(404).json("User not found!")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}

 // google login

exports.googleLogin = async (req, res) => {
    // console.log("Inside Google Login Function");
    const { username, email, password, profile } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            // token generation
            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.jwtKey)
            console.log(token);
            res.status(200).json({ message: "Google Login success", existingUser, token })
        }
        else {
            const newUser = new User({ username, email, password, profile })
            await newUser.save()
            // token generation
            const token = jwt.sign({ userMail: newUser.email, role: newUser.role }, process.env.jwtKey)
            console.log(token);
            res.status(200).json({ message: "Login success", existingUser: newUser, token })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}

 // display users in admin

exports.getUsers = async (req, res) => {
    try {
        const allUsers = await User.find({ role: { $ne: "Admin" } }) //noted
        res.status(200).json(allUsers)

    }
    catch (err) {
        res.status(500).json("Err" + err)
    }

}

// udate admin

exports.updateAdmin = async (req, res) => {
    console.log("inside update admin");

    // get body 
    const { username, password, bio, profile } = req.body
    // get email :paylod
    const email = req.payload
    // get role
    const role = req.role
    // update profile photo:req.file
    const uploadedProfile = req.file ? req.file.filename : profile

    try {
        const updateAdmin = await User.findOneAndUpdate({ email }, { username, email, password, profile: uploadedProfile, bio, role }, { new: true })
        await updateAdmin.save()
        res.status(200).json({ message: "Upload Successfully....", updateAdmin })

    }
    catch (err) {
        res.status(500).json("Err" + err)
    }

}

 // get admin

exports.getAdmin = async (req, res) => {
    try {
        const admin = await User.findOne({ role: "Admin" })
        res.status(200).json(admin)
    }
    catch (err) {
        res.status(500).json("Err" + err)
    }

}

// shebi
// update user details

exports.updateUser = async (req, res) => {
    console.log("inside update user");

    // get body
    const { username, password, bio, profile } = req.body;

    // from jwt middleware
    const email = req.payload;
    const role = req.role;

    // profile image
    const uploadedProfile = req.file ? req.file.filename : profile;

    try {
        const updatedUser = await User.findOneAndUpdate({ email }, { username, email, password, bio, profile: uploadedProfile, role }, { new: true });
        await updatedUser.save();

        res.status(200).json({
            message: "User updated successfully",
            updatedUser
        });

    } catch (err) {
        res.status(500).json("Err " + err);
    }
};

