var YOUTUBE_URL = 'https://www.youtube.com/embed/'
var VIMEO_URL = 'https://player.vimeo.com/video/'
var song_list  = [{'name': 'Eye of the Tiger', 'bpm': 137, 'id': 'NLAUW4_ZpVM', 'video_ts': '56','base_url':YOUTUBE_URL},
                  {'name': 'Eye of the Tiger', 'bpm': 116, 'id': '20248158', 'video_ts': '56', 'base_url':VIMEO_URL}]
var music_playing = false
var loaded_song = ''

class MusicController {
    constructor(){
        this.choose_random_song()
    }

    choose_random_song(){
        loaded_song = song_list[Math.floor(Math.random()*song_list.length)]
    }

    frames_per_beat(){
        return 60 / (song_list[0].bpm / 60)
    }

    play_song(){
        if (!music_playing){
            music_playing = true
            $('body').append('<iframe width="0" height="0" class="hidden" src="' + loaded_song.base_url + loaded_song.id + '?start=' + loaded_song.video_ts + '&autoplay=1"></iframe>')
        }
    }

    stop_song(){
        if (music_playing){
            music_playing = false
            $('iframe').remove()
        }
    }
}