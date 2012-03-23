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
        get_percentage = function( num, total, rfloat ) {
            /* Ret = Int || float
             * Percentage as floats ranges from 0 to 1. */
            var ret = num * 100 / total, 
                rfloat = typeof(rfloat)!="undefined" ? rfloat : false;

            return rfloat ? ret : Math.floor(ret);
        },
        seconds_to_minutes = function( s ) {
             var minutes = get_int( s / 60 ),
                 seconds = get_int( s % 60 );
            
             seconds = ( seconds < 10 ) ? "0" + seconds : seconds;
            
             return  minutes + ":" + seconds;
        },
        resize = function( $e, measure ) {
            /* Resize element based on parent size, and sibblings size to fully fill entire available space */
            var self = this,
                measure = measure || "both",
                resize = {},
                $p = $e.parent(),
                $s = $e.siblings(),
                width = 0,
                height = 0; 

            $s.each(function(){
               height += $(this).outerHeight(true);
               width  += $(this).outerWidth(true);
            });

            switch( measure ) {
                case "both":
                    resize.height = ($p.outerHeight(true) - height) + "px";
                    resize.width  = ($p.outerWidth(true) - width) + "px";
                    break;
                case "width":
                    resize.width  = ($p.outerWidth(true) - width) + "px";
                    break;
                case "height":
                    resize.height = ($p.outerHeight(true) - height) + "px";
                    break;
            }

            $e.css( resize )
        },
        set_element_draggable = function( $e, options ) {
            /* Can set directions that the element can be dragged "x", "y", "both" default "both"
            * Can align handle to "left" "right" or "center" default "center"
            * A parent for the dragger to be based on can be passed or it will assume its his parent container
            * Can also send option Callback, which will be fired at everytime during the dragging
            * Assumes element has position absolute and bounds have position relative
            */
            var ret = false,
                options = options || {},
                self = this;

            if( !$e.hasClass('draggable') )
            {
                $e.addClass('draggable');

                var direction =       options.direction || "both",
                align =               options.align || "center", 
                valign =              options.valign || "center", 
                $p =                  options.bounds || $e.parent(),
                unconstrain =         options.unconstrain || false,
                callback =            options.callback || {},
                callback_dragging =   callback.dragging || function(){},
                callback_stop =       callback.stop || function(){},

                stop_browser_default = function( event ) {
                    event.preventDefault();
                    event.stopPropagation();
                },
                dragging = function( event ) {
                     /* Element to be dragged and the bounds that he is attached to */
                    var leftval = null,
                        topval = null,
                        e = self.Bounds($e);  
                        p = self.Bounds($p); 

                    if( direction == "both" || direction == "x" )
                    {

                        var x_space = null;

                        switch( align  )
                        {
                            case "left":
                                x_space = 0;
                                break;
                            case "right":
                                x_space =  - e.width;
                                break;
                            case "center":
                                x_space =  - self.Int( e.width / 2 );
                                break;
                        }

                     if( event.clientX >= ( p.width - ( e.width ) ) + p.offsetLeft )
                          leftval = p.width - e.width;
                     else if( event.clientX <= p.offsetLeft + ( e.width ) )
                          leftval = 0;
                     else
                          leftval = event.clientX - p.offsetLeft + x_space;

                      $e.css({ left: leftval });
                    }

                    if( direction == "both" || direction == "y" )
                    {
                        var y_space = null;

                        switch( valign  )
                        {
                            case "top":
                                y_space = 0;
                                break;
                            case "bottom":
                                y_space =  - e.height;
                                break;
                            case "center":
                                y_space =  - self.Int( e.height / 2 );
                                break;
                        }

                     if( event.clientY >= ( p.height - ( e.height ) ) + p.offsetTop )
                          topval = p.height - e.height;
                     else if( event.clientY <= p.offsetTop + ( e.height ) )
                          topval = 0;
                     else
                          topval = event.clientY - p.offsetTop + y_space;

                      $e.css({ top: topval });
                    }

                    callback_dragging({ left: leftval, top: topval });
                },
                start_dragging = function(event){
                    dragging(event);
                },
                stop_dragging = function() {
                    if( $e.hasClass('dragging') ) 
                    {
                        $e.removeClass('dragging');
                        callback_stop();
                    }
                };

                $e.mousedown(function(event){
                    $e.addClass('dragging');
                    start_dragging(event);
                });

                $p
                .mousedown(function(event){
                    stop_browser_default(event);
                    $e.addClass('dragging');
                })
                .bind('click '+((unconstrain) ? '' :'mouseleave ')+'mouseup', function(event){
                    stop_browser_default(event);
                    stop_dragging();
                })

                $('body')
                .mouseup(function(event){
                    stop_browser_default(event);
                    stop_dragging();
                })
                .mousemove(function(event){
                    if( $e.hasClass('dragging') ) { start_dragging(event); }
                });

                
                ret = true;
            }

            return ret;
        },
        center = function( $e, $p ) {
            var self = this,
                $p = $p || $e.parent(),
                be = self.Bounds( $e );
                bp = self.Bounds( $p );
            $e.css({ top: self.Int(bp.height/2) - self.Int(be.height/2), left: self.Int(bp.width/2) - self.Int(be.width/2)});
        };
        return {
            Int: get_int,
            Float: get_float,
            Bounds: get_bounds,
            Percentage: get_percentage,
            Minutes: seconds_to_minutes,
            Draggable: set_element_draggable,
            Resize: resize,
            Center: center
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
       get_video_size = function() {
            return player.getVideoBytesTotal();
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
       load_video = function( opt, events ) {

            var callEvents = events; 

            function dispatcher( event ) {
                /* Load events when the player is ready */
                on_player_ready(event);
                callEvents();
            }

            return new YT.Player(opt.player, {
              height: 300,
              width: 550,
              videoId: opt.id,
              playerVars: { 
                'autoplay': opt.autoplay, 
                'wmode': 'opaque',
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0,
                'controls': 0 
              },
              events: {
                'onReady': dispatcher,
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
            Buffer: { 
                download: get_download_buffer,
                total: get_video_size
            },
            Volume: set_volume
       };
}());

/* Init */
Cstplayer.prototype.Init = (function( options ) { 

    // Extend settings to read from options
    if( options ) { for( prop in options ) { this.Settings[prop] = options[prop]; } }
    var self = this,
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

       events = function() {

            /* play toogle */
            $('div.cst_play_toogle').click(function(){ 
                self.Controllers.PlayToogle(); 
                
                $('div.cst_play_toogle').toggleClass('playing');
                $('div.cst_videoplayer div.cst_play_toogle').hide(); 
            });

            /* play toogle */
            $('div.cst_volume_toogle').click(function(){ 
                self.Controllers.SoundToogle(); 
                $(this).toggleClass('muted'); 
            })
            .mouseover(function(){
                $('div.cst_volume_bar').fadeIn('fast');   
                if(self.volumeTimmer) { window.clearTimeout(self.volumeTimmer) }
            })
            .mouseleave(function(){
                self.volumeTimmer = window.setTimeout(function(){
                    $('div.cst_volume_bar').fadeOut('normal');   
                }, 500);
            }); 

            $('div.cst_volume_bar')
            .bind('mouseover mousemove', function(){
                if(self.volumeTimmer) { window.clearTimeout(self.volumeTimmer); }
            })
            .mouseleave(function(){
                self.volumeTimmer = window.setTimeout(function(){
                    $('div.cst_volume_bar').fadeOut('normal');   
                }, 500);
            }); 


            self.Helper.Draggable($('.cst_progress_bar .cst_handle'), 
            {
                direction: "x",
                align: "center",
                callback: {
                  dragging:  function( position ) {
                        if(!this.progressbarCached) {
                            this.progressbarCached = { $indicator: $('.cst_progress_bar .cst_indicator'), bar_width: self.Helper.Int($('div.cst_progress_bar').css('width')) }
                        }

                       this.progressbarCached.steps = this.progressbarCached.bar_width / self.Controllers.Duration()

                       this.progressbarCached.$indicator 
                       .show() 
                       .css('left', position.left )
                       .html(self.Helper.Minutes(position.left / this.progressbarCached.steps));
                  },
                  stop: function() {
                      if(!this.progressbarCached) {
                           this.progressbarCached = { $indicator: $('.cst_progress_bar .cst_indicator'), bar_width: self.Helper.Int($('div.cst_progress_bar').css('width')) }
                      }
                      var steps = this.progressbarCached.bar_width / self.Controllers.Duration(),
                          playtime = self.Helper.Int(this.progressbarCached.$indicator.css('left')) / this.progressbarCached.steps;

                      self.Controllers.Seek(playtime);
                      this.progressbarCached.$indicator.hide()   
                      $('div.cst_videoplayer div.cst_play_toogle').hide();
                  }
                }
            });

            /* Add the volume bar helper */
            self.Helper.Draggable($('.cst_volume_bar .cst_handle'), 
            {   
                direction: "y",
                valign: "center",
                //unconstrain: true,
                callback: {
                  dragging:  function( position ) { 
                    if(!this.volumeCached) {
                        var $handle = $('.cst_volume .cst_handle'),
                            container_size = self.Helper.Int($('.cst_volume_bar').css('height')),
                            handle_size = self.Helper.Int($handle.css('height'));

                        this.volumeCached = { $handle: $handle, max_size: container_size - handle_size,  }; // cache variables
                    }
                    
                    this.volumeCached.volume = self.Helper.Percentage( self.Helper.Int(this.volumeCached.$handle.css('bottom')), this.volumeCached.max_size);
                    self.Controllers.Volume(this.volumeCached.volume);
                    $('div.cst_voume_itensity').css('height', this.volumeCached.volume + "%");
                  },  
                  stop: function() {
                    if(!this.volumeCached) {
                        var $handle = $('.cst_volume .cst_handle'),
                            container_size = self.Helper.Int($('.cst_volume_bar').css('height')),
                            handle_size = self.Helper.Int($handle.css('height'));

                        this.volumeCached = { $handle: $handle, max_size: container_size - handle_size,  }; // cache variables
                    }
                  }   
                }   
            }); 

            /* Main Loop */
            this.mainLoop = window.setInterval(function(){ 
                if(!this.loopCached) {

                    this.loopCached = { 
                        duration: self.Controllers.Duration(),
                        progresss_bar_width: self.Helper.Int( $('div.cst_progress_bar').css('width') ),
                        $cur: $('div.cst_indicator .cst_current'), 
                        $playing_bar: $('div.cst_playing'),
                        $download_bar: $('div.cst_downloading')
                    };

                    this.loopCached.play_step = this.loopCached.progresss_bar_width / this.loopCached.duration;


                    $('div.cst_indicator .cst_total').html( self.Helper.Minutes(this.loopCached.duration) ); // this is only called once 
                }

                var playing = self.Helper.Int(self.Controllers.Time() * this.loopCached.play_step),
                    download_step = ( self.Helper.Int( (this.loopCached.progresss_bar_width / self.Controllers.Buffer.total())  * self.Controllers.Buffer.download() ) ) || 0;

                this.loopCached.$playing_bar.css('width', playing + "px" );
                this.loopCached.$download_bar.css('width', download_step + "px" );
                this.loopCached.$cur.html( self.Helper.Minutes(self.Controllers.Time()) );
            },50 );

       };

        $('div.cstPlayer').css({
            height: self.Settings.height + "px",
            width: self.Settings.width + "px" 
        });

        self.Helper.Resize( $('div.cst_progress_bar'), 'width');
        self.Helper.Center($('.cst_videoplayer .cst_play_toogle'));
               
       return self.Controllers.Load( self.Settings, events );

    }());

   return true;
});

function onYouTubePlayerAPIReady() {
  //var
  player = new Cstplayer({ player: 'cst_video', id: 'CwC5BFX7rqQ' });
}
