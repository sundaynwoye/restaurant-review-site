function moveMapToBerlin(map) {
    map.setCenter({lat:52.5159, lng:13.3777});
    map.setZoom(13);
}

var platform = new H.service.Platform({
    apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map, {
        center: { lat: 50, lng: 5 },
        zoom: 4,
        pixelRatio: window.devicePixelRatio || 1
    });
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);
// Now use the map as required...
window.onload = function () {
    moveMapToBerlin(map);
    getDefaultLocation();
}
const autosuggest = (e) => {
    if(event.metaKey){
        return
    }

    let searchString = e.value
    if (searchString != "") {
        fetch(
            `https://autosuggest.search.hereapi.com/v1/autosuggest?apiKey=${window.apikey}&at=33.738045,73.084488&limit=5&resultType=city&q=${searchString}&lang=en-US`
        )
            .then((res) => res.json())
            .then((json) => {
                if (json.length != 0) {
                    document.getElementById("list").innerHTML = ``;
                    let dropData = json.items.map((item) => {
                        if ((item.position != undefined) & (item.position != ""))
                            document.getElementById("list").innerHTML += `<li onClick="addMarkerToMap(${item.position.lat},${item.position.lng},'${item.title}')">${item.title}</li>`;
                    });
                }
            });
    }
};

// Get User location after loading the page
let userLat = '';
let userLng = '';
function getDefaultLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLat =position.coords.latitude;
            userLng =position.coords.longitude;
            var title = "";
            addMarkerToMap(userLat, userLng, title);
            addInfoBubble(map);
        });
    } else {
        console.error("Geolocation is not supported by this browser!");
    }

}

// adding marker to map
const addMarkerToMap = (lat, lng, title) => {
    map.removeObjects(map.getObjects())
    document.getElementById("search").value =  title;
    var selectedLocationMarker = new H.map.Marker({ lat, lng });
    map.addObject(selectedLocationMarker);
    document.getElementById("list").innerHTML = ``;
    map.setCenter({ lat, lng });
};

// Get the Restaurant longitude and Latitude and add Marker
const addMarker = (group, restaurants) => {
    restaurants.map((item) => {
        var LocationOfMarker = {lat: item.lat, lng: item.long};
        var restaurantName = item.restaurantName;
        var address = item.address;

        addMarkerToGroup(group, LocationOfMarker, restaurantName, address,
            '<div >${restaurantName}<br>Address: ${address}</div>');

    })
}

/**
 * Creates a new marker and adds it to a group
 * @param {H.map.Group} group       The group holding the new marker
 * @param {H.geo.Point} coordinate  The location of the marker
 * @param {String} html             Data associated with the marker
 */
function addMarkerToGroup(group, coordinate, html) {
    // optionally - resize a larger PNG image to a specific size
    var pngIcon = new H.map.Icon("http://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png", { size: { w: 56, h: 56 } });

    // Create a marker using the previously instantiated icon:
    var marker = new H.map.Marker(coordinate, { icon: pngIcon });
    // add custom data to the marker
    marker.setData(html);
    group.addObject(marker);
}

/**
 * Clicking on a marker opens an infobubble which holds HTML content related to the marker.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addInfoBubble(map) {
    var group = new H.map.Group();

    map.addObject(group);

    // add 'tap' event listener, that opens info bubble, to the group
    group.addEventListener('tap', function (evt) {
        // event target is the marker itself, group is a parent event target
        // for all objects that it contains
        var bubble =  new H.ui.InfoBubble(evt.target.getGeometry(), {
            // read custom data
            content: evt.target.getData()
        });
        // show info bubble
        ui.addBubble(bubble);
    }, false);

    addMarker(group, restaurants);
    renderRestaurants(group);

    window.addEventListener('contextmenu', () => {
        alert("Click on the Map to add new Restaurant");
        setUpClickListener(group, map);
    })

}

/**
 * An event listener is added to listen to tap events on the map.
 * Clicking on the map add a new restaurant marker at the location pressed.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function setUpClickListener(group, map) {
    // Attach an event listener to map display
    map.addEventListener('tap', function getMouseCoord(evt) {
        var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);

        $("#staticBackdrop").modal("show");
        let submitButton = document.getElementById("add-restaurant");
        let restaurantName = document.getElementById("restaurant-name");
        let address = document.getElementById("address");
        let restaurantForm = document.getElementById("restaurant-form");

        // Validate user input
        restaurantName.addEventListener("input", ($event) => {
            if ($event.target.value.length >= 1 && $event.target.value.length <= 20) {
                submitButton.removeAttribute("disabled");
            } else {
                submitButton.setAttribute("disabled", "true");
            }
        })

        // Add the new restaurant
        submitButton.addEventListener("click", ($event) => {
            $event.preventDefault();
            let index = Math.round(coord.lat);
            let dataStar = 0;
            let starRoundedPercentage = `0%`;
            document.getElementById("ratings").innerHTML += `<li class="list-group-item" data-star="${dataStar}"><img src="http://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png" alt="My Example Image" width="30px" height="24px" />${restaurantName.value} <div class="stars-outer"><div class="stars-inner" style="width: ${starRoundedPercentage}"></div></div><p>${address.value}</p><div class="accordion accordion-flush" id="accordionFlushExampleThree${index}">
            <div class="accordion-item">
            <h2 class="accordion-header" id="flush-headingThree${index}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree${index}" aria-expanded="false" aria-controls="flush-collapseThree${index}">
                Reviews
              </button>
            </h2>
            <div id="flush-collapseThree${index}" class="accordion-collapse collapse" aria-labelledby="flush-headingThree${index}" data-bs-parent="#accordionFlushExampleThree${index}">
              <div class="accordion-body" id="new-restaurant${index}"><button type="button" class="btn btn-info btn-sm review-button" id="addNewRestaurantReview${index}" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="addReview('new-restaurant${index}')">
            Add Review
            </button><hr><h6>Others Review</h6></div>
            </div>
            </div>
            </div></li>`;
            document.getElementById("new-restaurant" + index).innerHTML += `<p>Rating: ${dataStar} Stars <br>Comments: No comment</p>`;

            addMarkerToGroup(group, {lat:coord.lat, lng:coord.lng},
                `<div>${restaurantName.value} <br> Address: ${address.value}</div>`);

            restaurantForm.reset();
        })
        map.removeEventListener('tap', getMouseCoord);

    });
}

// Add Marker on Restaurants from Google place API
function googlePlaceMarker(group, position, restaurantName, address) {
    var LocationOfMarker = {lat: position.lat, lng: position.lng};

    addMarkerToGroup(group, LocationOfMarker, restaurantName, address,
        '<div>${restaurantName} <br> Address: ${address}</div>');
}

