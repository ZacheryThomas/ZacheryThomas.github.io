function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

navigator.mediaDevices.getUserMedia({ video: true, audio: false}).then(function (stream, err) {
  if (err) return console.error(err)

  var Peer = SimplePeer
  var peer = new Peer({
    initiator: GetURLParameter('init') === 'true',
    trickle: false,
    stream: stream
  })

  peer.on('signal', function (data) {
    document.getElementById('yourId').value = lzw_encode(JSON.stringify(data))
  })

  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(lzw_decode(document.getElementById('otherId').value))
    peer.signal(otherId)
  })

  peer.on('data', function (data) {
    console.log("what the other person said: " + result)
    responsiveVoice.speak(data)
  })

  peer.on('stream', function (stream) {
    var video = document.createElement('video')
    document.body.appendChild(video)

    video.src = window.URL.createObjectURL(stream)
    video.play()
  })

  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    result = event.results[event.results.length - 1][0].transcript
    var utterance = new SpeechSynthesisUtterance(result);

    try {
      peer.send(result)
    }
    catch (err) {
      console.log(err)
    }
    console.log("what you said: " + result)
  }
  recognition.start();

})
