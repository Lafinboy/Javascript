function Cstplayer( options ){ this.Init( options ); } 

/* Settings */
Cstplayer.prototype.Settings = (function(){ 
    return {
        player: 'cst_video',
        width: 850,
        height: 450,
        autoplay: 0,
        id: null,
        volume: 100 
    };
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
        get_percentage = function( num, total, returnfloat ) {
            /* Ret = Int || float
             * Percentage as floats ranges from 0 to 1. */
            var ret = num * 100 / total, 
                rfloat = typeof(returnfloat)!=="undefined" ? rfloat : false;

            return rfloat ? ret : Math.floor(ret);
        },
        seconds_to_minutes = function( s ) {
             var minutes = get_int( s / 60 ),
                 seconds = get_int( s % 60 );
            
             seconds = ( seconds < 10 ) ? "0" + seconds : seconds;
            
             return  minutes + ":" + seconds;
        },
        resize = function( $e, mes ) {
            /* Resize element based on parent size, and sibblings size to fully fill entire available space */
            var self = this,
                measure = mes || "both",
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
                    resize.height = ($p.outerHeight(true) - height);
                    resize.width  = ($p.outerWidth(true) - width);
                    break;
                case "width":
                    resize.width  = ($p.outerWidth(true) - width);
                    break;
                case "height":
                    resize.height = ($p.outerHeight(true) - height);
                    break;
            }

            $e.css( resize );
        },
        set_element_draggable = function( $e, opt ) {
            /* Can set directions that the element can be dragged "x", "y", "both" default "both"
            * Can align handle to "left" "right" or "center" default "center"
            * A parent for the dragger to be based on can be passed or it will assume its his parent container
            * Can also send option Callback, which will be fired at everytime during the dragging
            * Assumes element has position absolute and bounds have position relative
            */
            var ret = false,
                options = opt || {},
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
                        e = self.Bounds($e),
                        p = self.Bounds($p); 

                    function _x() {

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

                        if( event.clientX >= ( p.width - ( e.width ) ) + p.offsetLeft ) {
                          leftval = p.width - e.width;
                        }
                        else if( event.clientX <= p.offsetLeft + ( e.width ) ) {
                          leftval = 0;
                        } 
                        else {
                          leftval = event.clientX - p.offsetLeft + x_space;
                        }

                        $e.css({ left: leftval });
                    }

                    function _y() {

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

                        if( event.clientY >= ( p.height - ( e.height ) ) + p.offsetTop ) {
                          topval = p.height - e.height;
                        }
                        else if( event.clientY <= p.offsetTop + ( e.height ) ) {
                          topval = 0;
                        }
                        else {
                          topval = event.clientY - p.offsetTop + y_space;
                        }

                        $e.css({ top: topval });

                    }

                    switch( direction ) 
                    {
                        case "x":
                            _x();
                            break;

                        case "y":
                            _y();
                            break;

                        default:
                            _x();
                            _y();

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
                }).
                click(function(event){
                    stop_browser_default(event);
                    start_dragging(event);
                    stop_dragging();
                    callback_stop();
                });

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
        center = function( $e, $parent ) {
            var self = this,
                $p = $parent || $e.parent(),
                be = self.Bounds( $e ),
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
            return ( state !== "playing" ) ? player.playVideo() : player.pauseVideo();
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
       },
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

    function autohide( $controllercontainer, $controller, hidespeed ) { 

               // Auto hide when starting
               var $n = $controllercontainer,
                   $c = $controller,
                   h = $controller.css('height'),
                   w = null,
                   t = hidespeed || 300; 
               
               $c.animate({ bottom: "-"+h }, t).removeClass('over');

               $n
               .mouseover(function(event) {
                   window.clearTimeout(w);
                   w = null;
                   $c.animate({ bottom: "0px" }, t).addClass('over');
               })
               .mouseleave(function(event) {
                   w = window.setTimeout(function(){
                       $c.animate({ bottom: "-"+h }, t).removeClass('over');
                   }, 400);
               }); 

    }

    function play( $centerplaybutton, $playbtn ) {
            var $c = $centerplaybutton,
                $p = $playbtn;

            /* play toogle */
            $p.click(function(){ 
                self.Controllers.PlayToogle(); 
                
                $p.toggleClass('playing');
                $c.hide(); 
            });
    }

    function seekbar( $progressbar, $handle, $indicator, $centerplaybutton ) {
            var $p = $progressbar,
                $h = $handle,
                $i = $indicator,
                $t = $centerplaybutton;


            self.Helper.Draggable( $h, {
                direction: "x",
                align: "center",
                callback: {
                  dragging:  function( position ) {
                        if(!this.progressbarCached) {
                            this.progressbarCached = { $indicator: $i, bar_width: self.Helper.Int($p.css('width')) };
                        }

                       this.progressbarCached.steps = this.progressbarCached.bar_width / self.Controllers.Duration();

                       this.progressbarCached.$indicator 
                       .show() 
                       .css('left', position.left )
                       .html(self.Helper.Minutes(position.left / this.progressbarCached.steps));
                  },
                  stop: function() {
                      if(!this.progressbarCached) {
                           this.progressbarCached = { $indicator: $i, bar_width: self.Helper.Int($p.css('width')) };
                      }
                      var steps = this.progressbarCached.bar_width / self.Controllers.Duration(),
                          playtime = self.Helper.Int(this.progressbarCached.$indicator.css('left')) / this.progressbarCached.steps;

                      self.Controllers.Seek(playtime);
                      this.progressbarCached.$indicator.hide();
                      $t.hide();
                  }
                }
            });
    }

    function volumebar( $volumetoggle, $volumebar, $volumecontainer, $volumehandle, $volumeblock ) {

            var $vt = $volumetoggle,
                $vb = $volumebar,
                $vc = $volumecontainer,
                $vh = $volumehandle,
                $vk = $volumeblock;

            var cacheVolume = function() {
                        var $handle = $vh,
                            container_size = self.Helper.Int($vb.css('height')),
                            handle_size = self.Helper.Int($handle.css('height'));

                    return { $handle: $handle, max_size: container_size - handle_size }; 
            }

            function updateVolume( volumecached ) {
                    var cache = volumecached, 
                        volume = self.Helper.Percentage( self.Helper.Int(volumecached.$handle.css('bottom')),volumecached.max_size);

                    self.Controllers.Volume(volume);
                    $vk.css('height', volume + "%");
            }

            $vt.click(function(){ 
                self.Controllers.SoundToogle(); 
                $(this).toggleClass('muted'); 
            })
            .mouseover(function(){
                $vb.fadeIn('fast');   
                if(self.volumeTimmer) { window.clearTimeout(self.volumeTimmer); }
            })
            .mouseleave(function(){
                self.volumeTimmer = window.setTimeout(function(){
                    $vb.fadeOut('normal');   
                }, 500);
            }); 

            $vc
            .bind('mouseover mousemove', function(){
                if(self.volumeTimmer) { window.clearTimeout(self.volumeTimmer); }
            })
            .mouseleave(function(){
                self.volumeTimmer = window.setTimeout(function(){
                    $vb.fadeOut('normal');   
                }, 500);
            }); 

            $vc.click(function(){
                    updateVolume(cacheVolume());
            });

            /* Add the volume bar helper */
            self.Helper.Draggable($vh, 
            {   
                direction: "y",
                valign: "center",
                //unconstrain: true,
                callback: {
                  dragging:  function( position ) { 
                    if(!this.volumeCached) {
                        this.volumeCached = cacheVolume();
                    }
                    
                    updateVolume(this.volumeCached);
                  },  
                  stop: function() {
                    if(!this.volumeCached) {
                        this.volumeCached = cacheVolume();
                    }
                  }   
                }   
            }); 
    }

    function mainloop( $containerprogressbar, $totaltime, $curtimer, $playingbar, $downloadingbar ) {

            var $k = $containerprogressbar,
                $t = $totaltime,
                $c = $curtimer,
                $p = $playingbar,
                $d = $downloadingbar;

            /* Main Loop 
             * Here is where the videp dowload bar will be updated and the timer
             * */
            this.mainLoop = window.setInterval(function(){ 
                if(!this.loopCached) {

                    this.loopCached = { 
                        duration: self.Controllers.Duration(),
                        progresss_bar_width: self.Helper.Int( $k.css('width') ),
                        $cur: $c, 
                        $playing_bar: $p,
                        $download_bar: $d
                    };

                    this.loopCached.play_step = this.loopCached.progresss_bar_width / this.loopCached.duration;


                    $t.html( self.Helper.Minutes(this.loopCached.duration) ); // this is only called once 
                }

                var playing = self.Helper.Int(self.Controllers.Time() * this.loopCached.play_step),
                    download_step = ( self.Helper.Int( (this.loopCached.progresss_bar_width / self.Controllers.Buffer.total())  * self.Controllers.Buffer.download() ) ) || 0;

                this.loopCached.$playing_bar.css('width', playing );
                this.loopCached.$download_bar.css('width', download_step );
                this.loopCached.$cur.html( self.Helper.Minutes(self.Controllers.Time()) );
            },50 );

    }

    function fit( $videoplayer, $progressbar, $centerplaybutton ) {

        var $v = $videoplayer,
            $b = $progressbar,
            $c = $centerplaybutton;

        $v.css({
            height: self.Settings.height,
            width: self.Settings.width 
        });

        self.Helper.Resize($b, 'width');
        self.Helper.Center($c);
    }
    
    // Extend settings to read from options
    if( options ) { 
        var setting;
        
        for( setting in options ) { 
           if( typeof(this.Settings[setting]) !== 'undefined' ) {
              this.Settings[setting] = options[setting]; 
           }
        } 
    }
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
            // attach events

            autohide($('div.cst_controllers_container'), $('div.cst_controllers'));  // auto hide controllers

            play($('div.cst_videoplayer div.cst_play_toogle'), $('div.cst_play_toogle')); // play button and center play button

            seekbar( $('div.cst_progress_bar'), $('.cst_progress_bar .cst_handle'), 
                    $('.cst_progress_bar .cst_indicator'), $('div.cst_videoplayer div.cst_play_toogle') ); // seekbar for playing and download

            volumebar( $('div.cst_volume_toogle'), $('div.cst_volume_bar'), 
                    $('div.cst_volume_itensity_container'), $('div.cst_volume_bar .cst_handle'), $('div.cst_voume_itensity') ); // Volume toogle and bar

            mainloop( $('div.cst_progress_bar'), $('div.cst_indicator .cst_total'), 
                    $('div.cst_indicator .cst_current'), $('div.cst_playing'), $('div.cst_downloading') ); // Main loop to update things
       };

       fit( $('div.cstPlayer'), $('div.cst_progress_bar'), $('.cst_videoplayer .cst_play_toogle') ); // Resize to fit boundaries

               
       return self.Controllers.Load( self.Settings, events );

    }());

   return true;
});

function onYouTubePlayerAPIReady() {
  //var
  player = new Cstplayer({ player: 'cst_video', id: 'CwC5BFX7rqQ' });
}
