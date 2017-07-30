jQuery('input').css('opacity', '0.0');

$(document).ready(function(){
    $('input').change(function(event) {
        $(".container").append("<img id='img' class='hide' src=''>")
        var preview = document.getElementById('img')
        var file    = document.querySelector('input[type=file]').files[0]; //sames as here
        var reader  = new FileReader();

        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        } else {
            preview.src = "";
        }

        reader.onloadend = function () {
            preview.src = reader.result;
        }
        $('img').on('load', function(){
            find_eyes(preview, add_image)
            $('img').remove()
            $('input').val('')
        })
    });
});

function find_eyes(preview, add_image){
    var img = document.getElementById('img');
    var tracker = new tracking.ObjectTracker(['eye']);
    var eyes = []

    tracker.setStepSize(1.7);
    tracking.track('#img', tracker);
    tracker.on('track', function(event) {
        event.data.forEach(function(rect) {
            if (eyes.length < 6){
                eyes.push([rect.x, rect.y, rect.width, rect.height])
            }
        });
        add_image(preview, eyes)
    });


    /*window.plot = function(x, y, w, h) {
        var rect = document.createElement('img')
        document.querySelector('#image-container').appendChild(rect);
        rect.src = '../images/brown_eyes_round.png'
        rect.classList.add('rect');
        rect.style.width = w + 'px';
        rect.style.height = h + 'px';
        rect.style.left = (img.offsetLeft + x) + 'px';
        rect.style.top = (img.offsetTop + y) + 'px';
    };*/
}
