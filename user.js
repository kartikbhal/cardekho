const {createHmac, randomBytes} = require("crypto");
const {Schema, model} = require('mongoose')

const userSchema=new Schema({
    fullNname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
        

    },
    password: {
        type: String,
        require: true,
    },
    
}, 
{timestams: true}
);

userSchema.pre("save", function (next) {
    const user=this;

    if(!user.isModified("password")) return;

    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac("sha256, salt")
    .update(user.password)
    .digest("hex");

    this.salt=salt;
    this.password=hashedPassword;

    next();
});

userSchema.static('matchPassword', async function(email,password){
    const user= await this.findOne({email});
    if (!user) throw new Error('User not found');
    console.log(user);

    const salt = user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac("sha256" , salt)
    .update(userpassword)
    .digest("hex");

    if(hashedPassword !== userProvidedHash)  throw new Error('incorrect Password')

    return user;

})

const User=model('user' , userSchema);

module.exports=User;



