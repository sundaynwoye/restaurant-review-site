# Restaurant review site - OpenClassrooms
### Step 1: Restaurants
Start with the real foundation of your application. There will be 2 main sections:
* A Google Maps map loaded with the Google Maps API
* A list of restaurants on the right side of the page that are within the area displayed on the map
* 
The Google Maps map will focus immediately on the position of the user. You'll use the JavaScript geolocation API. A specific color marker should be shown at the user's current location.

A list of restaurants is provided as JSON data in a separate file. Normally, this data would be returned to the backend of your application by an API, but for this exercise, it's sufficient just to load the list of restaurants directly into memory!

Show restaurants on the map based on their GPS coordinates. Restaurants that are currently visible on the map should be displayed in list form on the side of the map as mentioned above. You will see the average reviews of each restaurant (ranging from 1 to 5 stars). These ratings come from your JSON file (not real reviews).

When you click on a restaurant, the list of reviews should be shown. Also show the Google Street View photo via the corresponding API! 

A filter tool allows the display of restaurants that have between X and Y stars. The map should be updated in real-time to show the corresponding restaurants.
### Step 2: Add restaurants and reviews
* Add a review about an existing restaurant
* Add a restaurant by clicking on a specific place on the map
### Step 3: Integration with Google Places API
