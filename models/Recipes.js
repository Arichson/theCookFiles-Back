const { Schema, model } = require('mongoose');
const recipeSchema = new Schema({
    id: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    image: {type: String, required: true},
})

module.exports = model('recipes', recipeSchema)




