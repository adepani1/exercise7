const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'cannot be empty']}, 
    lastName: {type: String, required: [true, 'cannot be empty']}, 
    email: {type: String, required: [true, 'cannot be empty'], unique: true}, 
    password: {type: String, required: [true, 'cannot be empty']},
})

userSchema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password')) 
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash => {
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
    
});

// implement method to compare login password and stored hash password in the DB
userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
    // returning a promise to the caller because its ascyn
}


module.exports = mongoose.model('User', userSchema);