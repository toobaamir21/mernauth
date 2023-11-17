const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
    },
}
);

userSchema.statics.signup = async function(email,password){
  //validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  //The throw statement throws a user-defined exception. Execution of the current function will stop (the statements after throw won't be executed), and control will be passed to the first catch block in the call stack. If no catch block exists among caller functions, the program will terminate
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, password: hash });
  return user;
}
//login
userSchema.statics.login = async function(email,password) {
     if (!email || !password) {
       throw Error("All fields must be filled");
     }
     if (!validator.isEmail(email)) {
       throw Error("Email is not valid");
     }
     const user = await this.findOne({email})
     if (!user) {
      throw Error("Email Doesn't exist")
     }
     const match = await bcrypt.compare(password,user.password)
     if (!match) {
      throw Error("Incorrect Pasword")
     }
     return user
}
module.exports = mongoose.model("User", userSchema);
