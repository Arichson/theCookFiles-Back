const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipes = require("../models/Recipes")
const {jsonAuth, auth} = require('./authController')



/////////////  /:userid/recipes/:recipeName

router.get('/', (req, res) => {
    console.log(res.locals)
   const userQuery = User.find({}).select('-password').populate('recipes') 
   userQuery.exec((err, foundUsers) => {
       if (err){
           console.log(err);
           res.status(401).json({ msg: err.message });
       } else {
          res.status(200).json(foundUsers) 
       }
   })
})
// add Recipes to users
// existing

// shows all Recipes for a specific user
router.get('/:username', (req, res) => {
    const userQuery = User.findOne({username: req.params.username}).select('-password').populate('recipes')

    userQuery.exec((err, foundUser) => {
        if(err) {
            res.status(400).json({
                msg: err.message
            })
        } else {
            res.status(200).json(foundUser)
        }
    })
})

// edit the user
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true } )
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

router.get('/:username/recipes/', async (req, res) => {

    try {
        const usersRecipe = await Recipes.find({});
        res.status(200).json(usersRecipe)
    }catch(error){
        res.status(400).json({
            msg: error.message
        })
    }
})
router.post('/:username/recipes', async (req,res) => {
    try { 
        const createRecipe = await Recipes.create(req.body)
        res.status(200).json(createRecipe)
    } catch(err){
        res.status(400).json({
            msg: err.message
        })
    }
})
router.post('/:username/recipes/:id', async (req, res) => {
    const recipeQuery = Recipes.findOne({_id:req.params.id})
    // console.log(recipeQuery)
    // res.status(200).json(recipeQuery)
    recipeQuery.exec( async (err, recipe) => {
        if(err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            const addRecipeQuery = User.findOneAndUpdate({ username: req.params.username}, {$addToSet: {recipes: recipe._id}}, {new: true})
            console.log("//////////////")
            console.log({addRecipeQuery})
            addRecipeQuery.exec((err, updatedUser) => {
                // console.log(updatedUser)
                if(err){
                    res.status(400).json({
                        msg: err.message
                    }) 
                } else {
                    console.log(updatedUser);
                    res.status(200).json({
                        msg: `SUCCESS!!!! Updated user with the recipe ${recipe.title}.`
                    })
                }
            })
        }
    })
})
router.get('/:username/recipes/:id', async (req, res) => {
    try {
        const foundRecipe = await Recipes.findById(req.params.id);
        
        res.status(200).json(foundRecipe)
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})
router.delete('/:username/recipes/:id', auth, async (req, res) => {
    try {
        const deletedRecipes = await Recipes.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedRecipes);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

router.delete('/:id', auth, async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})
module.exports = router