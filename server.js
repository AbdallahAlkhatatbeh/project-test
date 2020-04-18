'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 4000 ;
const cors = require('cors');
const superagent = require('superagent');

const app = express();
app.use(cors());
app.set('view engine', 'ejs');


// app.use(express.static( './public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) =>{
  res.render('index');
});
app.get('/search/new',(req,res)=>{
  res.render('search');
});


app.post('/search', (req, res) => {
  let Recipesarr = [];
  let url;
  console.log(req.body.SearchFor);
  url=`https://api.edamam.com/search?q=${req.body.SearchFor}&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`;

  superagent.get(url)
    .then(data =>{

      data.body.hits.map( element =>{

        const recipes= new Recipes(element.recipe);
        Recipesarr.push(recipes);
      });
      //   if(recipes.title===$('searchForRecipe').val()){
      res.render('result' , {search:Recipesarr});
    //   }} );
    });
});


function Recipes(details){
  this.title=details.label;
  this.imgurl=details.image;
  this.dietLabels=details.dietLabels;
  this.healthLabels=details.healthLabels;
  this.ingredientLines=details.ingredientLines;
  this.calories=details.calories;
  this.totalTime=details.totalTime;
  this.totalNutrients=details.totalNutrients;

  Recipes.all.push(this);
}
Recipes.all = [];

app.get('*',(req,res)=>{
  res.status(404).send('Not found');
});

app.listen(PORT, () => console.log(`up and running on port ${PORT}`));
