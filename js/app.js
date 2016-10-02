/*jslint node: true */
/*global document, window, alert, console, require, $*/
"use strict";
var activeWindow;
var windowWidth = document.documentElement.clientWidth;
var canonicalurl;

var nearbyLocations = [{
    "title": "Eagle Creek Beach",
    "street": "7602 Eagle Beach Dr.",
    "city": "Indianapolis, IN 46204",
    "url": "www.indy.gov/eGov/City/dpr/Pages/IndyParksHome.aspx",
    "wiki": "Eagle_Creek_Park",
    "markerID": "0",
    "lat": 39.854418,
    "lng": -86.300630
}, {
    "title": "Eagle Creek Park",
    "street": "7840 W 56th St.",
    "city": "Indianapolis, IN 46278",
    "url": "www.indy.gov/eGov/City/DPR/ECPark/Pages/default.aspx",
    "wiki": "Eagle_Creek_Park",
    "markerID": "1",
    "lat": 39.869585,
    "lng": -86.296129
}, {
    "title": "Eagle Creek Golf Club",
    "street": "8802 W 56th St.",
    "city": "Indianapolis, IN 46234",
    "url": "eaglecreekgolfclub.com/",
    "wiki": "Eagle_Creek_Park",
    "markerID": "2",
    "lat": 39.852365,
    "lng": -86.318492
}, {
    "title": "Colts Training Facility",
    "street": "7001 W 56th St.",
    "city": "Indianapolis, IN 46254",
    "url": "www.colts.com/",
    "wiki": "Indianapolis_Colts",
    "markerID": "3",
    "lat": 39.85009679,
    "lng": -86.28416593
}, {
    "title": "Bankers Life Fieldhouse",
    "street": "125 S Pennsylvania St.",
    "city": "Indianapolis, IN 46204",
    "url": "www.bankerslifefieldhouse.com/",
    "wiki": "Bankers_Life_Fieldhouse",
    "markerID": "4",
    "lat": 39.764117,
    "lng": -86.155555
}, {
    "title": "Indianapolis Motor Speedway",
    "street": "4790 W 16th St.",
    "city": "Indianapolis, IN 46222",
    "url": "www.indianapolismotorspeedway.com/",
    "wiki": "Indianapolis_Motor_Speedway",
    "markerID": "5",
    "lat": 39.795310,
    "lng": -86.235330
}, {
    "title": "Indianapolis Art Center",
    "street": "820 East 67th Street",
    "city": "Indianapolis, IN 46220",
    "url": "www.indplsartcenter.org/",
    "wiki": "Indianapolis_Art_Center",
    "markerID": "6",
    "lat": 39.878026,
    "lng": -86.143631
}, {
    "title": "Indianapolis Zoo",
    "street": "1200 W Washington St.",
    "city": "Indianapolis, IN 46222",
    "url": "www.indianapoliszoo.com/SitePages/Home.aspx",
    "wiki": "Indianapolis_Zoo",
    "markerID": "7",
    "lat": 39.76672,
    "lng": -86.176938
}];

var Location = function(data) {
    this.title = ko.observable(data.title);
};
var viewModel = function() {
    var self = this;
    self.places2 = ko.observableArray(nearbyLocations);

    // Triggers google maps 'click' function when a nearbyLocation is clicked
    self.currentLocation = ko.observable(self.places2()[0]);
    self.setLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
        google.maps.event.trigger(clickedLocation.marker, 'click');
    };

    // Open list menu
    self.showRow = ko.observable(false);
    self.toggleVisibility = function() {
        var drawer = document.querySelector('#drawer');
        self.showRow(self.showRow());
        drawer.classList.toggle('open');
    };

    //Close list menu
    self.showRow = ko.observable(true);
    self.toggleHide = function() {
        var drawer = document.querySelector('#drawer');
        self.showRow(self.showRow());
        drawer.classList.remove('open');
    };

    // Search filter
    self.query = ko.observable('');
    self.search = ko.computed(function() {
        return ko.utils.arrayFilter(self.places2(), function(place) {
            return place.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });

    // Display list of nearbyLocations in a list view
    self.search = ko.computed(function() {
        for (var i = 0; i < nearbyLocations.length; i++) {
            nearbyLocations[i].marker.setVisible(true);
        }
        // Matches search regardless of case and hides locations that do not match
        return ko.utils.arrayFilter(nearbyLocations, function(place) {
            if (place.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                return true;
            }

            place.marker.setVisible(false);
            return false;
        });
    });
    // alert("vm");
};

var map, bounds;

function initMap() {

    //Custom styled map features
    var styles = [{
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [{
            "color": "#060606"
        }]
    }, {
        "featureType": "administrative.province",
        "elementType": "geometry",
        "stylers": [{
            "color": "#43706d"
        }, {
            "weight": "0.82"
        }]
    }, {
        "featureType": "administrative.province",
        "elementType": "labels.text",
        "stylers": [{
            "color": "#76a000"
        }, {
            "weight": "0.43"
        }, {
            "lightness": "28"
        }, {
            "gamma": "0.61"
        }]
    }, {
        "featureType": "administrative.locality",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#ff0000"
        }]
    }, {
        "featureType": "administrative.locality",
        "elementType": "labels.text",
        "stylers": [{
            "weight": "0.39"
        }]
    }, {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#d4001a"
        }]
    }, {
        "featureType": "administrative.locality",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#ae8989"
        }, {
            "gamma": "3.68"
        }, {
            "lightness": "87"
        }, {
            "weight": "3.15"
        }]
    }, {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ebebeb"
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#e5dfdf"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#f0f0f0"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#ff761e"
        }, {
            "gamma": "1.61"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#ffa600"
        }]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
            "color": "#a9ff00"
        }]
    }, {
        "featureType": "road.arterial",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#e3e1bf"
        }]
    }];

    //Creates new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(39.854456, -86.299879),
        zoom: 12,
        styles: styles,
        mapTypeControl: false,
        disableDefaultUI: true
    });

    bounds = new google.maps.LatLngBounds();


    function makeMarker(location) {

        var data, results, url, wikiTitle;
        var clientID = "EWDIWXWFSZ0QTCQ5JG2UV0O4NLXYIKLZJ35QEK4OKDDLMBJN";
        var clientSecret = "KB3JYUOSBLA4A2Y2U0QO3TH2JQ4YF0PQJSEVIXL11JCQVBMA";
        var foursquareURL = 'https://api.foursquare.com/v2/venues/search?limit=1&ll=' + location.lat + ',' + location.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160930';

        $.ajax({
            type: "GET",
            url: foursquareURL,
            cache: true,
            dataType: 'jsonp',
        }).done(function(data) {

            location.results = data.response.venues[0].url;
            console.log(data);

        }).fail(function(jqXHR, textStatus) {
            alert("Sorry FourSquare Ajax request failed...(" + textStatus + ' - ' + jqXHR.responseText + ").");
        });




        var wiki_title = location.wiki;
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrsearch=' + wiki_title + '&gsrprop=snippet&prop=info&inprop=url&callback=wikiCallback';

        $.ajax({
            type: "GET",
            url: wikiUrl,
            cache: true,
            dataType: 'jsonp',
        }).done(function(data) {
            var pages = data.query.pages;
            //Object keys are needed for the way Wikipedia wraps its API data
            var firstPage = pages[Object.keys(pages)[0]];
            location.wikiTitle = firstPage.canonicalurl;
            console.log(location.wikiTitle);

        }).fail(function(jqXHR, textStatus) {
            alert("Sorry Wikipedia Ajax request failed... (" + textStatus + ' - ' + jqXHR.responseText + ").");
        });


        var latlng = new google.maps.LatLng(location.lat, location.lng);
        var title = location.title;
        var markerImage = location.markerID;
        var icon;

        //Apply different marker icon images to markers based off individual id.
        if (markerImage <= 3) {
            icon = "dist/images/birds-min.png";
        } else if (markerImage >= 4) {
            icon = "dist/images/default-min.png";
        }

        // Create a marker per location, and put into markers array.
        location.marker = new google.maps.Marker({
            position: latlng,
            title: title,
            map: map,
            icon: icon,
            animation: google.maps.Animation.DROP,
            id: i
        });

        bounds.extend(location.marker.position);

        var headingImageView = 300;

        var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=375x100&location=';

        var streetViewImage = streetViewUrl +
            location.lat + ',' + location.lng +
            '&fov=75&heading=' + headingImageView + '&pitch=10&key=AIzaSyBrJDgnXnmHgqhboMWRxlBTAC303aBf0QM';

        var infowindow = new google.maps.InfoWindow();

        //Click marker to view infoWindow, zoom and center location.
        google.maps.event.addListener(location.marker, 'click', function() {

            //Binds infoWindow content to each marker
            var contentString = '<img src="' + streetViewImage +
                '" alt="Street View Image of ' + location.title + '"><br><hr style="margin-bottom: 5px"><strong>' +
                location.title + '</strong><br><p class="wiki">' +
                location.street + '<br>' +
                location.city + '<br></p><p>Site URL: <a href="http://' + location.url +
                '" target="_blank">' + location.url + '</a><br><p>FourSquare: <a href="' + location.results +
                '" target="_blank"><i class="fa fa-foursquare" aria-hidden="true"></i>  ' + location.results + '</a><br><p>Wikipedia: <a href="' + location.wikiTitle +
                '" target="_blank"><i class="fa fa-wikipedia-w" aria-hidden="true"></i>  ' + location.wikiTitle + '</a>';

            infowindow.setContent(contentString); {

                //Close active window if one exists
                if (activeWindow != null)
                    activeWindow.close();
                //Open new window
                infowindow.open(map, location.marker);
                //Store new window in global variable
                activeWindow = infowindow;
            }
            //Zooms in on location clicked
            if (windowWidth <= 1080) {
                map.getZoom(10);
            } else if (windowWidth > 1080) {
                map.getZoom(17);
            }

            map.setCenter(location.marker.getPosition());
            toggleBounce(location.marker);
            // alert("click");
        });

        return location.marker;

    }
    // Set's bounce animation to marker with a timer on it so it doesn't keep bouncing forever
    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1400);
        }
    }
    // Loops the makeMarker function for the length of the nearbyLocations array and keeps object information specific to its own marker
    for (var i = 0; i < nearbyLocations.length; i++) {
        nearbyLocations[i].marker = makeMarker(nearbyLocations[i]);
    }

    window.onresize = function() {
        map.fitBounds(bounds);
    }

    //  Activate knockout bindings
    ko.applyBindings(new viewModel());

    function googleError() {
        if (typeof(google) === null) {
            alert("Sorry, Google Maps is currently unavailable. Please try later.");
        }
    }

}
