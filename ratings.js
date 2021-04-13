// Get ratings
const getRating = (restaurants) => {
    restaurants.map((item, index) => {
        let address = item.address;
        // sum = sum of stars
        let sum = 0;
        for (let i = 0; i < item.ratings.length; i ++) {
            sum += item.ratings[i].stars;
        }
        let averageRating = (sum / item.ratings.length) * 10;
        let dataStar = Math.round(averageRating / 10) * 10;
        let starRoundedPercentage = `${Math.round(averageRating / 10) * 10}%`;
        document.getElementById("ratings").innerHTML += `<li class="list-group-item" data-star="${dataStar}"><img src="http://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png" alt="My Example Image" width="30px" height="24px" />${item.restaurantName} <div class="stars-outer"><div class="stars-inner" style="width: ${starRoundedPercentage}"></div></div><p>${address}</p><div class="accordion accordion-flush" id="accordionFlushExample${index}">
        <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingOne${index}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne${index}" aria-expanded="false" aria-controls="flush-collapseOne${index}">
            Reviews
          </button>
        </h2>
        <div id="flush-collapseOne${index}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne${index}" data-bs-parent="#accordionFlushExample${index}">
          <div class="accordion-body" id="customer-review${index}"><button type="button" class="btn btn-info btn-sm review-button" id="addRestaurantReview${index}" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="addReview('customer-review${index}')">
        Add Review
        </button><hr><h6>Others Review</h6></div>
        </div>
      </div>
        </div></li>`;
        for (let i = 0; i < item.ratings.length; i ++) {
            document.getElementById("customer-review" + index).innerHTML += `<p>Rating: ${item.ratings[i].stars} stars <br>Comments: ${item.ratings[i].comment}</p>`
        }

    })
}
getRating(restaurants);

/* Filter restaurant between X and Y */
// Get the filter element
let filter = document.getElementById("filter");
// Add event listener
filter.addEventListener('change', ($event) => {
    let listItems = document.querySelectorAll('.list-group-item');
    let value = $event.target.value;
    switch (value) {
        case "0":
            for (let i = 0; i < listItems.length; i++) {
                if (listItems[i].dataset.star === "0") {
                    listItems[i].style.display = "";
                } else {
                    listItems[i].style.display = "none";
                }
            }
            break;
        case "1":
            for (let i = 0; i < listItems.length; i++) {
                if (listItems[i].dataset.star === "10" || listItems[i].dataset.star === "20") {
                    listItems[i].style.display = "";
                } else {
                    listItems[i].style.display = "none";
                }
            }
            break;
        case "2":
            for (let i = 0; i < listItems.length; i++) {
                if (listItems[i].dataset.star === "30" || listItems[i].dataset.star === "40") {
                    listItems[i].style.display = "";
                } else {
                    listItems[i].style.display = "none";
                }
            }
            break;
        case "3":
            for (let i = 0; i < listItems.length; i++) {
                if (listItems[i].dataset.star === "50" || listItems[i].dataset.star === "60") {
                    listItems[i].style.display = "";
                } else {
                    listItems[i].style.display = "none";
                }
            }
            break;
        case "4":
            for (let i = 0; i < listItems.length; i++) {
                if (listItems[i].dataset.star === "70" || listItems[i].dataset.star === "80") {
                    listItems[i].style.display = "";
                } else {
                    listItems[i].style.display = "none";
                }
            }
            break;
        case "5":
            for (let i = 0; i < listItems.length; i++) {
                if (listItems[i].dataset.star === "90" || listItems[i].dataset.star === "100") {
                    listItems[i].style.display = "";
                } else {
                    listItems[i].style.display = "none";
                }
            }
            break;
        default:
            console.log("Select Option");
    }
})

/* fetch data from google place api */

// Get nearby restaurant place ID
async function getRestaurants(lat, lng) {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=restaurant&rankby=distance&key=${googleKey}`;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// Get restaurant details
async function getRestaurantDetails(placeId) {
    let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,rating,review&key=${googleKey}`;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// Render restaurants
async function renderRestaurants(group) {
    let googlePlaceRestaurant = await getRestaurants(userLat, userLng);
    googlePlaceRestaurant.results.map(async (item, index) => {
        let placeId = item.place_id;
        let detailData = await getRestaurantDetails(placeId);
        let position = detailData.result.geometry.location;
        let address = detailData.result.formatted_address;
        let review = detailData.result.reviews;

        googlePlaceMarker(group, position, detailData.result.name, address);
        let averageRating = '';
        if (detailData.result.rating > 0) {
            averageRating = detailData.result.rating * 10;
        } else {
            averageRating = 0;
        }
        let dataStar = Math.round(averageRating / 10) * 10;
        let starRoundedPercentage = `${Math.round(averageRating / 10) * 10}%`;
        document.getElementById("ratings").innerHTML += `<li class="list-group-item" data-star="${dataStar}"><img src="http://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png" alt="My Example Image" width="30px" height="24px" />${detailData.result.name} <div class="stars-outer"><div class="stars-inner" style="width: ${starRoundedPercentage}"></div></div><p>${address}</p><div class="accordion accordion-flush" id="accordionFlushExampleTwo${index}">
        <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingTwo${index}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo${index}" aria-expanded="false" aria-controls="flush-collapseTwo${index}">
            Reviews
          </button>
        </h2>
        <div id="flush-collapseTwo${index}" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo${index}" data-bs-parent="#accordionFlushExampleTwo${index}">
          <div class="accordion-body" id="googleRestaurant-review${index}"><button type="button" class="btn btn-info btn-sm review-button" dtata-class="google-place-${index}" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="addReview('googleRestaurant-review${index}')">
        Add Review
        </button><hr><h6>Others Review</h6></div>
        </div>
      </div>
        </div></li>`;
        for (let i = 0; i < review.length; i++) {
            if (review[i].text) {
                document.getElementById("googleRestaurant-review" + index).innerHTML += `<p>Rating: ${detailData.result.rating} Stars <br>Comments: ${review[i].text}</p>`;
            } else {
                document.getElementById("googleRestaurant-review" + index).innerHTML += `<p>Rating: ${detailData.result.rating} Stars <br>Comments: No comment</p>`;
            }
        }

    })
}

/* Rate and add comment */
const addReview = (id) => {
    let rating = document.getElementById("rating");
    let commentText = document.getElementById("comment-text");
    let reviewForm = document.getElementById("review-form");
    let saveButton = document.getElementById("add-review");

    // Validate user input
    rating.addEventListener("input", ($event) => {
        let x = Number($event.target.value);
        if (x >= 1 && x <= 5) {
            saveButton.removeAttribute("disabled");
        } else {
            saveButton.setAttribute("disabled", "true");
        }
    })

    // Save and add user comment
    saveButton.addEventListener("click", () => {
        document.getElementById(id).innerHTML += `<p>Rating: ${rating.value} Stars <br>Comments: ${commentText.value}</p>`;
        reviewForm.reset();
    })
}

