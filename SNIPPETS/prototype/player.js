function Cstplayer( options ){ this.Init( options ); } 

/* Settings */
Cstplayer.prototype.Settings = (function(){ 
    return {
        player: 'cst_video',
        width: 550,
        height: 300,
        autoplay: 0,        
        volume: 100 
    }
}());

/* Helper class 
 * Refactor this bit to
 * wrapp it outside of object later on 
 * */
Cstplayer.prototype.Helper = (function(){
        var get_int = function( str ) {
            return parseInt( str, 10 );
        },
        get_float = function( str ) {
            return parseFloat( str );
        },
        get_bounds = function( $e ) {
            return {
                offsetTop: get_int($e.offset().top),
                offsetLeft: get_int($e.offset().left),
                width: get_int($e.css('width')),
                height: get_int($e.css('height'))
            };
        },
        get_percentage = function( percentage, num, rfloat ) {
            /* Ret = Int || float
             * Percentage as floats ranges from 0 to 1. */
            var ret = num * percentage, 
                rfloat = typeof(rfloat)!="undefined" ? rfloat : false;

            return rfloat ? ret : Math.floor(ret);
        },
        seconds_to_minutes = function( s ) {
             var minutes = get_int( s / 60 ),
                 seconds = get_int( s % 60 );
            
             seconds = ( seconds < 10 ) ? "0" + seconds : seconds;
            
             return  minutes + ":" + seconds;
        },
        resize = function( $e, $p ) {

        },
        center = function( $e, $p ) {
        
        };
        return {
            Int: get_int,
            Float: get_float,
            Bounds: get_bounds,
            Percentage: get_percentage,
            Minutes: seconds_to_minutes
        };
}());

/* General Controllers */
Cstplayer.prototype.Controllers = (function(){ 
       var state = "unstarted",  
       player = null,
       toogle_play = function() {
            return ( state != "playing" ) ? player.playVideo() : player.pauseVideo();
       },
       toogle_sound = function() {
            return ( player.isMuted() ) ? player.unMute() : player.mute();
       }, 
       get_download_buffer = function() {
            return player.getVideoBytesLoaded();
       },
       get_ellapsed_time = function() {
            return ( player ) ? player.getCurrentTime() : 0;
       },
       get_duration = function() {
            return ( player ) ? player.getDuration() : 0;
       }
       set_video_time = function( num, allowSeekAhead ) {
            return player.seekTo( num, allowSeekAhead );
       },
       set_volume = function( num ) {
            return player.setVolume( num );
       },
       state_change = function( code ) {
            switch( code.data ) {
                case -1:
                    state = "unstarted";
                    break;
                case 0:
                    state = "ended";
                    break;
                case 1:
                    state = "playing";
                    break;
                case 2:
                    state = "paused";
                    break;
                case 3:
                    state = "bufferring";
                    break;
                case 5:
                    state = "cued";
                    break;
            }

            return state;
       },
       show_error = function( data ) {
            switch( data ) {

            }
       },
       on_player_ready = function( evnt ) {
           player = evnt.target;
           set_volume(100);
       },
       load_video = function( opt ) {
            return new YT.Player(opt.player, {
              height: 300,
              width: 550,
              videoId: opt.id,
              playerVars: { 
                'autoplay': opt.autoplay, 
                'controls': 0 
              },
              events: {
                'onReady': on_player_ready,
                'onStateChange': state_change,
                'onError': show_error
              }
            });
       };

       return {
            Load: load_video,
            PlayToogle: toogle_play,
            SoundToogle: toogle_sound,
            Seek: set_video_time,
            Time: get_ellapsed_time,
            Duration: get_duration,
            Buffer: get_download_buffer,
            Volume: set_volume
       };
}());

/* Init */
Cstplayer.prototype.Init = (function( options ) { 

    // Extend settings to read from options
    if( options ) { for( prop in options ) { this.Settings[prop] = options[prop]; } }
    var self = this,
    player = this.Controllers.Load( this.Settings ),
    build = (function() 
    {
       var html = (function() {
           var create_controllers = (function() {

               var controller_container = (function(){
                    
               }()),
               
               create_play = (function(){ 
                   return true; 
               }()),

               create_progress_bar = (function(){ 
                   return true; 
               }()),

               create_volume = (function(){ 
                   return true; 
               }());

               return {
                    play: create_play,
                    progress_bar: create_progress_bar,
                    volume: create_volume
               };
           }()),
           create_player = (function() {

           }());

           return {
                controllers: create_controllers,
                player: create_player 
           };
       }()),
       events = (function() {
            $('div.cst_play_toogle').click(function(){ self.Controllers.PlayToogle(); $(this).toggleClass('red'); }); // play toogle
            $('div.cst_volume_toogle').click(function(){ self.Controllers.SoundToogle(); $(this).toggleClass('red'); }); // play toogle

            /* updating the indicator bar */
            window.setInterval(function(){ 
                $('div.cst_indicator .current').html( self.Helper.Minutes(self.Controllers.Time()) );
                $('div.cst_indicator .total').html( self.Helper.Minutes(self.Controllers.Duration()) );
            },50 );
       }());
        
       return html.player;
    }());

   return true;
});

function onYouTubePlayerAPIReady() {
  //var
  player = new Cstplayer({ player: 'cst_video', id: 'pdLGRQ3CFLI' });
}
