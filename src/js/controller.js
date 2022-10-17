import * as model from './model.js';
import recipeView from './views/resipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

if(module.hot){
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

async function controlRecipes() {
  try {
    // Get recipe ID
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    // Update results view to mark selecteed sreach result
    resultsView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks);
    // 1) Loading recipe
    await model.loadRecipe(id);
    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
    
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
}

async function controlSearchResults(){
  try {
    resultsView.renderSpinner();
    // Get query 
    const query =searchView.getQuery();
    if (!query) return;

    // Search & Load results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render pagination buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.error(err);
  }
}

function controlPagination(goToPage){
 
  // Render new results
 resultsView.render(model.getSearchResultsPage(goToPage));

 // Render new pagination buttons
 paginationView.render(model.state.search);
}

function controlServings(newServings){
  // Update the recipe servings (in state)
  model.updateServings(newServings)
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

function controlAddBookmark(){
  // Add / Remove bookmark
  model.addBookmark(model.state.recipe);
  
  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmark view
  bookmarksView.render(model.state.bookmarks)
}

function controlBookmarks(){
  bookmarksView.render(model.state.bookmarks)
}

async function controlAddRecipe(newRecipe){
  try {
    //Render spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
   await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render the recipe 
    recipeView.render(model.state.recipe);

    // Rendr success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL 
    window.history.pushState(null,'',`#${model.state.recipe.id}` )

    // Close form 
   setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  } catch (error) {
    addRecipeView.renderError(error.message);
  }
}

function init(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSreach(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)
};
init();