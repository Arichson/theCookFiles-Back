const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: String,
    firstName: String,
    lastName: String,
    birthday: String,
    recipes: [{ type: Schema.Types.ObjectId, ref:'recipes' }]
})
module.exports = model("User", userSchema)