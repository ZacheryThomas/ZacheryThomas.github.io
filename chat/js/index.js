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
    var otherId = lzw_decode(JSON.parse(document.getElementById('otherId').value))
    peer.signal(otherId)
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + '\n'
  })

  peer.on('stream', function (stream) {
    var video = document.createElement('video')
    document.body.appendChild(video)

    video.src = window.URL.createObjectURL(stream)
    video.play()
  })
})