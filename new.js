
const FmealList = document.getElementById('Favmeal');
const FmealDetailsContent = document.querySelector('.Favmeal-details-content');
const FrecipeCloseBtn = document.getElementById('Favrecipe-close-btn');


var likeArr = (JSON.parse(localStorage.getItem('like')));
if(likeArr == null){
    likeArr = [];
}





function loadLike(id){
    
    
    for( i=0 ; i<likeArr.length; i++){
        if(id == likeArr[i]){
            
            return('<i class="fa fa-heart fa-2x" aria-hidden="true"></i>');
        }
    }
    return('<i class="fa fa-heart-o fa-2x" aria-hidden="true"></i>');
   
}

 
function like(id){
    // console.log(id);

    if ($("#"+id).hasClass("liked")) {
        
            $("#"+id).html('<i class="fa fa-heart-o fa-2x" aria-hidden="true"></i>');
            $("#"+id).removeClass("liked");
            for( var i = 0; i < likeArr.length; i++){ 
    
                if ( likeArr[i] === id) { 
            
                    likeArr.splice(i, 1); 
                }
            
            }            
            localStorage.setItem('like', JSON.stringify(likeArr));
        } else {
            $("#"+id).html('<i class="fa fa-heart fa-2x" aria-hidden="true"></i>');
            $("#"+id).addClass("liked");
            likeArr.push(id);
            localStorage.setItem('like', JSON.stringify(likeArr));

        }
}

// var x = (JSON.parse(localStorage.getItem('like')));
// console.log(x);


FmealList.addEventListener('click', FgetMealRecipe);
FrecipeCloseBtn.addEventListener('click', () => {
    FmealDetailsContent.parentElement.classList.remove('FavshowRecipe');
});


let html = "";
for (i = 0; i < likeArr.length; i++) {
    console.log(likeArr[i]);
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${likeArr[i]}`)
        .then(response => response.json())
        .then(data => {
            
            if (data.meals) {
                data.meals.forEach(meal => {

                    html += `
                    <div class = "Favmeal-item" data-id = "${meal.idMeal}">
                        <div class = "Favmeal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "Favmeal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Recipe</a>
                        </div>
                    </div>
                `;
                });
                FmealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                FmealList.classList.add('notFound');
            }

            FmealList.innerHTML = html;
        });

}





// get recipe of the meal
function FgetMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        //console.log(mealItem);
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => FmealRecipeModal(data.meals));
    }
}

// create a modal
function FmealRecipeModal(meal) {
    //console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "Favrecipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    FmealDetailsContent.innerHTML = html;
    FmealDetailsContent.parentElement.classList.add('FavshowRecipe');
}
