
import { async } from 'regenerator-runtime';
import { API_URL, KEY_API, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
function createRecipeObject(data){
  const { recipe } = data.data;
   return{
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      cookingTime: recipe.cooking_time,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      bookmarked: false,
      ...(recipe.key && {key: recipe.key}),
}
}
export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY_API}`);

    
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    }
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
}

export async function loadSearchResults(query) {
  try {
    state.search.page = 1;
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY_API}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key}),
      };
    });
  } catch (err) {
    console.error(`${err} 💣💣💣`);
    throw err;
  }
}

export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //10;

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= newServings / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
  // Mark current recipe as bookmark or not
  if (recipe.id === state.recipe.id)
    state.recipe.bookmarked = !state.recipe.bookmarked;

  if (state.recipe.bookmarked)
    // Add  the recipe to the Bookmarks
    state.bookmarks.push(recipe);
  else {
    //  Remove the recipe from the Bookmarks
    state.bookmarks = state.bookmarks.filter(
      bookmark => bookmark.id !== recipe.id
    );
  }
  // Add the new bookmarks array to the localStorege
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function initModel() {
  const storege = localStorage.getItem('bookmarks');
  if (storege) state.bookmarks = JSON.parse(storege);
}
initModel();


export async function uploadRecipe(newRecipe) {
  try {
      const ingredients = Object.entries(newRecipe).filter(
        entry => entry[0].startsWith('ingredient') 
        && entry[1] !== '').map(
        ing =>{
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3) throw new Error('Wrong Ingredient format! Please use   the correct format :)');

        const [quantity,unit,description] = ingArr;
        return {quantity:quantity? +quantity: null ,unit,description}
      });
      const recipe = {
        title: newRecipe.title,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        servings: +newRecipe.servings,
        ingredients,
      }
      const data = await AJAX(`${API_URL}?key=${KEY_API}`,recipe);
      state.recipe = createRecipeObject(data);
      addBookmark(state.recipe);

  } catch (err) {
      throw err
    }
}
