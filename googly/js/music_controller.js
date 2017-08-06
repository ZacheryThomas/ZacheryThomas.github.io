var YOUTUBE_URL = 'https://www.youtube.com/embed/'
var song_list  = [{'name': 'Eye of the Tiger', 'bpm': 137, 'youtube_id': 'NLAUW4_ZpVM', 'youtube_ts': '55s'}]
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
            $('body').append('<iframe width="0" height="0" class="hidden" src="'+YOUTUBE_URL + loaded_song.youtube_id + '?t=' + loaded_song.youtube_ts + '&autoplay=1"></iframe>')
        }
    }

    stop_song(){
        if (music_playing){
            music_playing = false
            $('iframe').remove()
        }
    }
}