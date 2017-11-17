/*
step2 1: initial phase

step 2: survey phase

step 3: end of survey
*/

// map initializer
mymap = L.map('mapid').setView([getRandomArbitrary(-75, 75), getRandomArbitrary(0, 180)], 13);

// url for map tilesheet
tilesheetUrl = 'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'

ip_api = 'https://ipapi.co/json/'
ipInfo = ''

questions = [
    { 'question': 'If you look outside, are there trees?', 'answers': ['Yes', 'No'] },
    { 'question': 'Mayo or Ketchup?', 'answers': ['Ketchup', 'Mayo', 'Hot Sauce'] },
    { 'question': 'Is it raining?', 'answers': ['Yes', 'No'] },
    { 'question': 'Do you listen to Soulja Boy?', 'answers': ['Yes', 'No'] },
    { 'question': 'What year was America founded?', 'answers': ['1911', '2016', '1492'] },
    { 'question': 'What is your favorite pet?', 'answers': ['Dog', 'Cat', 'Ant Farm'] },
    { 'question': 'I miss the...', 'answers': ['Old Kanye', 'Office'] },
    { 'question': 'Is Uber more popular than Lyft where you are?', 'answers': ['Yes', 'No'] },
    { 'question': 'Have you ever read a book?', 'answers': ['Yes', 'No'] },
    { 'question': 'Do you watch Anime?', 'answers': ['Yes', 'No'] },
    { 'question': 'Can you run to the nearest City?', 'answers': ['Yes', 'No'] },
    { 'question': "Is it daytime right now?", 'answers': ['Yes', 'No'] },
    { 'question': 'Have you ever cried at your current location?', 'answers': ['Yes', 'No', "Unsure"] },
    { 'question': 'Quarter Brick, Half a brick, Whole brick', 'answers': ['AYE!', 'OK!'] },
]

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


/**
 * Dumps all info from main element
 */
function dump() {
    $('#main').empty()
}

function setup() {
    L.tileLayer(tilesheetUrl, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    $.getJSON(ip_api, function (data) {
        ipinfo = data
    });
}


/** Converts numeric degrees to radians */
if (typeof (Number.prototype.toRadians) === "undefined") {
    Number.prototype.toRadians = function () {
        return this * Math.PI / 180;
    }
}

function coodinatesToDistance(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // metres
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2 - lat1).toRadians();
    var Δλ = (lon2 - lon1).toRadians();

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}


function step1() {
    setup()

    $('#stepOne').show();
    $('#stepTwo').hide()
    $('#stepThree').hide()

    $("#startButton").click(function () {
        $('#startButton').off()
        step2()
    });
}

function step2() {
    $('#stepOne').hide();
    $('#stepTwo').show()
    $('#stepThree').hide()


    var current = 0
    var end = 10
    var circle = undefined
    mymap.setView([0, 0], 2) // default zoom level


    function nextTrial() {
        current = current + 1

        // get random question set
        let qIndex = Math.floor(Math.random() * questions.length)
        let q = questions[qIndex];
        questions.splice(qIndex, 1)


        // set questions and answers
        $('#question').text(q.question)
        $('#answers').empty().append('<div class="btn-group btn-group-vertical" data-toggle="buttons">')
        for (ans of q.answers) {
            $('#answers').append('<label class="btn"> \
                                  <input style="visibility: hidden" type="radio" name="ans"> \
                                  <i class="fa fa-circle-o fa-2x"></i> \
                                  <i class="fa fa-dot-circle-o fa-2x"></i> \
                                  <span>' + ans +'</span> \
                                  </label>')
        }
        $('#answers').append('</div>')

        // move to finish
        if (current == end) {
            $('#nextButton').off()
            step3()
        }
    }
    nextTrial()

    function updateMap(){
        function noise(current){
            return (74 * Math.pow(current, 4))/5775 - (2372 * Math.pow(current, 3))/5775 + (54731 * Math.pow(current, 2))/11550 - (55501 * current)/2310 + 50
        }

        // set new zoom lvl and such
        noiseLat = ipinfo.latitude + getRandomArbitrary(0, noise(current + 1))
        noiseLong = ipinfo.longitude + getRandomArbitrary(0, noise(current + 1))
        mymap.setView([noiseLat, noiseLong], Math.floor(end * (current / end)))

        if (circle)
            mymap.removeLayer(circle)

        console.log(coodinatesToDistance(noiseLat, noiseLong,
            ipinfo.latitude, ipinfo.longitude))

        circle = L.circle([noiseLat, noiseLong], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.2,
            radius: coodinatesToDistance(noiseLat, noiseLong,
                ipinfo.latitude, ipinfo.longitude) + 20000 // add 20 km to radius
        }).addTo(mymap);
    }


    $("#nextButton").click(function () {
        nextTrial()
        updateMap()
    });
}

function step3() {
    $('#stepOne').hide();
    $('#stepTwo').hide()
    $('#stepThree').show()

    $('#city').text(ipinfo.city)
    $('#region').text(ipinfo.region)
}

step1()


$(window).resize(function () {
    $('#main').css({
        position: 'absolute',
        left: ($(window).width() - $('#main').outerWidth()) / 2,
        top: ($(window).height() - $('#main').outerHeight()) - 30
    });

    //for(btn of $('.advancer')){
    //    $(btn).css({
    //        position: 'absolute',
    //        left: ($(window).width() - $(btn).outerWidth()) / 2,
    //    })
    //}

});

// To initially run the function:
$(window).resize();