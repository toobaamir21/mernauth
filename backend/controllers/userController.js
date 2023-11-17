const User = require("../models/userModel");
const jwt = require('jsonwebtoken')

//generating jwt token
const createToken=(_id)=>{
    return jwt.sign({_id},"process.env.SECRET",{expiresIn:'3d'})
}

//login controller
const login = async(req,res)=>{
   const {email,password}=req.body
   try {
     const user = await User.login(email, password);

     //creating token for signedup users
     const token = createToken(user._id);

     res.status(200).json({ email, token });
   } catch (error) {
     res.status(400).json({ error: error.message });
   }

}

//signup controller
const signup = async (req, res) => {
  const {email,password} = req.body
  try {
    const user = await User.signup(email,password)

    //creating token for signedup users
    const token = createToken(user._id)


    res.status(200).json({email,token})
  } catch (error) {
    res.status(400).json({error:error.message})
  }
};

module.exports = {login,signup}