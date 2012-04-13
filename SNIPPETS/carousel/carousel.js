function Carousel(){ return this.Initialize(); }
Carousel.prototype = {
    Elements: {
        ThumbContainer: null,
        Thumbs: null,
        MainImage: null,
        MainImageAnchor: null,
        NextButton: null,
        PrevButton: null,
        FirstTile: null
    },
    Animation: {
        Controllers: {
            core: {
                settings: {
                    duration: 300
                },
                moveThumbsLeft: function( $container ) {
                    $container.prepend( $container.find('li:nth-child(3)').detach() );
                },
                moveThumbsRight: function( $container ) {
                    $container.append( $container.find('li:first-child').detach() );
                }
            },
            next: function( $container ) {
                this.core.moveThumbsRight( $container ); 
            },
            prev: function( $container ) {
                this.core.moveThumbsLeft( $container ); 
            }
        },
        Maintile: {
            core: {
                settings: {
                    duration: 750,
                    fadding_duration: 300,
                    player: false,
                    playing: false,
                    slice: 15 
                },
                playVideo: function( youtubeid ) {
                    this.settings.playing = true;

                    this.settings.player = new YT.Player("cstVideo", {
                      height: 334,
                      width: 596,
                      videoId: youtubeid,
                      playerVars: { 
                        'autoplay': 1, 
                        'autohide': 1, 
                        'wmode': 'opaque',
                        'modestbranding': 1,
                        'rel': 0,
                        'showinfo': 0,
                        'controls': 1 
                      },  
                      events: {
                        'onReady': function(e) {
                            e.target.playVideo();
                        },
                        'onStateChange': function(code) {
                            switch( code.data ) {
                                case -1:
                                    // unstarted
                                    break;
                                case 0:
                                    // ended
                                    // delete player and restore carousel slideshow
                                    break;
                                case 1:
                                    // playing
                                    break;
                                case 2:
                                    // paused
                                    break;
                                case 3:
                                    // bufferring
                                    break;
                                case 5:
                                    // cued
                                    break;
                            }
                        },
                        'onError': function(e) {
                            if (window.console) console.log('error: ', e);
                        }
                      }   
                    }); 
                },
                stopVideo: function() {
                   $('#cstVideo').replaceWith('<div id="cstVideo" />');
                   this.settings.playing = false;
                },
                updateMainImage: function( $element, $maintile ) {
                    $maintile.attr('src', $element.attr('data-largeImage') );
                    $('#carouselCurTile').attr({
                            target: $element.attr('data-target'), 
                            href: $element.attr('data-href'),
                            "data-youtubeid": $element.attr('data-youtubeid') || ""
                    });
                },
                slideCurtain: function( direction, $maintile )
                {

                    this.animating = true;

                    var self = this,
                        stripes = $maintile.find('div.stripes'),
                        steps = this.settings.duration / this.settings.slice,
                        _t = steps;

                    switch( direction ) 
                    {
                        case "left":
                            stripes.reverse().each(function() {
                                
                              var $el = $(this);
                                  _t += steps;
                               window.setTimeout( function() {
                                    $el.fadeOut(self.settings.fadding_duration); 
                               }, _t );
                            });
                            break;

                        case "right":
                            stripes.each( function() {
                                
                              var $el = $(this);
                                  _t += steps;
                               window.setTimeout( function() {
                                    $el.fadeOut(self.settings.fadding_duration); 
                               }, _t );
                            });
                            break;

                        default:
                            throw "Must select a direction";
                    }

                   if( this.timer ) { window.clearTimeout( this.timer ); }
                   this.timer = window.setTimeout( function() { 
                     stripes.css("background-image", "url("+ $maintile.find('img').attr('src') + ")" );
                     stripes.show();
                     self.animating = false;
                   }, this.settings.duration * 2 );
                }
            },
            update: function( $element, direction, maintile ) {
                var self = this;

                function update( $element, direction, maintile ) {
                    direction = direction ? "left" : "right";
                    self.core.updateMainImage( $element.find('img'), maintile.find('img') );
                    self.core.slideCurtain( direction, maintile );
                }

                if( !this.core.animating ) 
                { 
                    update( $element, direction, maintile );
                }
                else 
                {
                    // try again
                   if( this.timer ) { window.clearTimeout( this.timer ); }
                   this.timer = window.setTimeout( function() 
                   { 
                      update( $element, direction, maintile );
                   }, self.core.settings.duration * 2 ); 
                } 
            },
            build: function( $displayTile ) {
                var self = this;

                var $img =  $displayTile.find('img');

                $displayTile.css({
                    position: 'relative',
                    width: $img.attr('width') + "px",
                    height: $img.attr('height') + "px",
                    overflow: 'hidden'
                });

                var imgwidth = parseInt( $img.attr('width'), 10 );

                var squareSize = parseInt( (imgwidth / self.core.settings.slice), 10 );
                
                var stripe = { 
                    width: squareSize + "px",
                    height: ( parseInt( $img.attr('height'), 10 ) ) + "px",
                    position: 'absolute',
                    background: 'url(' + $img.attr('src') +') no-repeat',
                    top: "0px",
                    left: "0px"
                };
                
                var $s;
                
                for( var i=0; i<this.core.settings.slice; i++ )
                {
                    $s = $displayTile.append("<div class='stripes' />");
                    stripe.backgroundPosition = -( parseInt( stripe.width, 10 ) * i ) +"px 0px";
                    stripe.left = ( parseInt( stripe.width, 10 ) * i ) + "px";
                    $( $s.find('div.stripes')[i] ).css(stripe);
                }

                /* In case that its not a perfect division, add an extra rectangle on the end with the size that is left to fill the gap */
                if( squareSize * self.core.settings.slice !==  imgwidth ) {
                    // add another square on the missing gap
                    $s = $displayTile.append("<div class='stripes' />");
                    stripe.width = ( imgwidth - ( squareSize * self.core.settings.slice ) );
                    stripe.backgroundPosition = -( imgwidth - stripe.width  ) +"px 0px";
                    stripe.left = ( squareSize * self.core.settings.slice ) + "px";
                    $( $s.find('div.stripes')[i] ).css(stripe);
                }
            }
        },
        Thumbnails: {
            core: {
                settings: {
                    duration: 300
                },
                slideDown: function( $element )
                {
                    $element.find('span.carouselOverlay').fadeIn(this.settings.duration);

                    $element.find('div.thumbTextContainer').animate({ 
                        top: '0px' 
                    }, this.settings.duration );

                    $element.find('div.thumbImageContainer').animate({ 
                        top: ( $element.find('div.thumbTextContainer')[0].offsetHeight - 15 ) + "px"
                    }, this.settings.duration );
                },
                slideUp: function( $element )
                {
                    var $textContainer = $element.find('div.thumbTextContainer'); 

                    $element.find('span.carouselOverlay').hide();

                    $element.find('div.thumbTextContainer').animate({ 
                        top: (parseInt( $textContainer.css('top'), 10 ) - $textContainer[0].offsetHeight) + "px"
                    }, this.settings.duration / 2 );

                    $element.find('div.thumbImageContainer').animate({ 
                        top: "0px"
                    }, this.settings.duration / 2 );
                }
            },
            thumbOver: function( $element ) 
            {

                if(!$element.hasClass('animating') && !$element.hasClass('over'))
                {

                    $element.addClass('animating over');
                    
                    this.core.slideDown( $element );

                    if( $element.timer ) { window.clearTimeout( $element.timer ); }
                    $element.timer = window.setTimeout(function(){ $element.removeClass('animating'); },this.core.settings.duration * 1.2);
                }
            },
            thumbOut: function( $element )
            {
                var self = this;

                $element.removeClass('over');

                if( !$element.hasClass('active') ) 
                {

                    if( !($element.hasClass('animating') ) )
                    {

                        $element.addClass('animating');

                        self.core.slideUp( $element );

                        if( $element.timer ) { window.clearTimeout( $element.timer ); }
                        $element.timer = window.setTimeout(function(){ $element.removeClass('animating'); },this.core.settings.duration );
                    } 
                    else
                    {
                        if( $element.timer ) { window.clearTimeout( $element.timer ); }
                        $element.timer = window.setTimeout(function(){ self.core.slideUp( $element ); }, this.core.settings.duration );
                    }
                }
            },
            thumbActive: function( $element, container )
            {
                var $container = container;
                
                if( !$element.hasClass('active') )
                {
                    var self = this,
                           currentElements = $container.find('li'),
                        direction = true; // assume left

                    var arr = $container.find('li.active');

                    $.each( arr, function() {
                        direction = currentElements.index($(this)) > currentElements.index($element);
                        $(this).removeClass('active');
                        self.core.slideUp( $(this) );
                    });

                    $element.addClass('active');

                    return direction;
                }
            }
        }
    },
    selectTile: function( $tile, direction ) {
        /*
         * direction BOOL
         * True = right to left
         * false = left to right
         */
        var $selectTile = $tile; 
        this.Animation.Thumbnails.thumbOver($selectTile);
        var _direction = this.Animation.Thumbnails.thumbActive( $selectTile, this.Elements.ThumbContainer );
        direction = ( typeof(direction) !== "undefined" ) ? direction : _direction; 

        this.Animation.Maintile.update($selectTile , direction, this.Elements.MainTile );

        $selectTile.removeClass('over');
    },
    toogleSlideShow: function( stop ) {
        var ret = true,
            cyclingTimer = 6000,
            jumptiles = 3,
            self = this;


        if( this.toogleSlideShowTimer || stop ) 
        { 
            this.toogleSlideShowTimer = window.clearInterval( this.toogleSlideShowTimer ); 
            this.restartSlideshow = window.clearInterval( this.restartSlideshow );

            // restart carousel if there is no video playing
            if( !self.Animation.Maintile.core.settings.playing ) {
                this.restartSlideshow = window.setTimeout( function() { self.toogleSlideShow(); }, cyclingTimer ); // if on IDLE for 6 seconds start slideshow again
            }
            ret = false;
        } 
        else 
        {
            this.toogleSlideShowTimer = window.setInterval(function() {
                var $curActive = self.Elements.ThumbContainer.find('li.active'),
                    index = self.Elements.ThumbContainer.find('li').index( $curActive ),
                    nextTile = $curActive.next().length ? $curActive.next() : self.Elements.ThumbContainer.find('li:first-child');

                if( index === 2 ) 
                {
                    var _totalTiles =  self.Elements.Thumbs.length;
                    

                    if( _totalTiles === jumptiles ) 
                    {
                        // Only 3 carousel tiles, and in that case assuming minimum of 3 tiles
                        nextTile = self.Elements.ThumbContainer.find('li:first-child');
                    } 
                    else 
                    {
                        for( var i=0; i<jumptiles; i++ ) {
                            self.Animation.Controllers.next( self.Elements.ThumbContainer );
                        }
                    }
                }

                self.selectTile( nextTile );

            }, cyclingTimer);
        }
        
        return ret;
    },
    events: function()
    {
        var self = this;

        self.Elements.Thumbs
            .mouseover(function(){
                if( !$('body').hasClass('mobile') ) { self.Animation.Thumbnails.thumbOver($(this)); }
            })
            .mousedown(function(event){
                event.preventDefault();
            })
            .mouseleave(function(){
                self.Animation.Thumbnails.thumbOut($(this));
            })
            .click(function(event){
                event.preventDefault();
                self.toogleSlideShow( true ); // stop slideshow
                self.Animation.Thumbnails.thumbOver($(this));
                self.Animation.Maintile.core.stopVideo(); // if there is any video playing stop it before animating

                var direction = self.Animation.Thumbnails.thumbActive($(this), self.Elements.ThumbContainer );
                self.Animation.Maintile.update($(this) , direction, self.Elements.MainTile );
            });

        self.Elements.MainTile.click(function(event) {
            // Check if it is a video
            if( $(this).attr('data-youtubeid') ) 
            {
               event.preventDefault();
               self.Animation.Maintile.core.playVideo( $(this).attr('data-youtubeid') );
               self.toogleSlideShow(true); // stop slideshow
            }
        });

        self.Elements.PrevButton.click(function(event) {
            event.preventDefault();
            self.toogleSlideShow( true ); // stop slideshow
            self.Animation.Controllers.prev( self.Elements.ThumbContainer );
        });

        self.Elements.NextButton.click(function(event) {
            event.preventDefault();
            self.toogleSlideShow( true ); // stopslideshow
            self.Animation.Controllers.next( self.Elements.ThumbContainer );
        });
    },
    Initialize: function()
    {    
        $.fn.reverse = [].reverse;  // add reverse to jquery lib  
        
        this.Elements = {
            ThumbContainer:    $('#carousel ul'),
            Thumbs:            $('#carousel li'),
            MainTile:          $('#carouselCurTile'),
            NextButton:        $('#carouselNext'),
            PrevButton:        $('#carouselPrev')
        };
        
        this.Elements.Thumbs.find('img').each(function(){(new Image()).src = $(this).attr('data-largeimage'); }); // start downloading carousel images
        this.Animation.Maintile.build( this.Elements.MainTile ); // attach events
        this.selectTile( this.Elements.ThumbContainer.find('li:first-child'), false );
        this.toogleSlideShow(); // start slideshow
        this.events(); // attach events
    }
};

function onYouTubePlayerAPIReady() {
    window.carousel = new Carousel(); 
}

$(function(){  
      // Load youtube player API 
      (function(d,t) {
          var g=d.createElement(t), 
          s=d.getElementsByTagName(t)[0]; 

          g.async=1;
          g.src="http://www.youtube.com/player_api";

          s.parentNode.insertBefore(g,s)
      }(document,"script"));
});
