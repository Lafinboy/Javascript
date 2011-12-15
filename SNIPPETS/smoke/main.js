window.onload = init;

function Snow( options )
{
    var self = this;

    this.numParticles = 500;
    this.particles = [];
    this.running_animation = null;

    this.generate_canvas = function( container, holder ) 
    {
       var canvas = this.canvas = document.createElement('canvas'),
           compatible = canvas.getContext('2d');

       if( compatible ) 
       {
           container.replaceChild( canvas, holder );
       }

       canvas.height = this.height = container.offsetHeight;
       canvas.width = this.width = container.offsetWidth;

       return ( compatible ) ? canvas : false; 
    }

    this.addParticle = function( context ) 
    {
        for( var i=0; i<this.numParticles; i++ ) 
        {
           var p = new Particle( context, { x: self.width, y: self.height } ); 
           p.create();
           this.particles[this.particles.length] = p; 
        }

        loopAnimation();
    }

    function loopAnimation()
    {
        self.running_animation = window.setInterval( callAnimation, 50 );
    }

    function callAnimation()
    {
        eraseCanvas();
        for( var i=0; i<self.numParticles; i++ ) 
        {
            self.particles[i].animate();
        }
    }

    function eraseCanvas()
    {
        self.canvas.width = self.width;
    }
}

function CanvasOB( context )
{
    this.context = context;
    this.size = 10;
    this.position = { x: 0, y: 0 };
    this._position = {};

    this.redraw  = function() { };

    this.restore = function() {
        this.set_position( this._position.x, this._position.y );    
    };

    this.get_position  = function() {
        return this.position; 
    };

    this.set_position  = function( x, y ) {
        this.position.x = x; 
        this.position.y = y; 
    };

    this.set_size = function( size ) {
        this.size = size; 
    };
}

function Particle( context, boundaries ) 
{
    var self = this;
    this.__proto__ = new CanvasOB( context );
    this.boundaries = boundaries;
    this.animX = Math.ceil( Math.random() * 2 );
    this.animY = Math.ceil( Math.random() * 3 ) + 3;

    this.redraw = function( x, y, size )
    {
        var size = ( self.size + 1 ) < 30 ? self.size + 1 : 30;
        self.set_size( size );
        this.context.fillStyle = "rgba( 255, 255, 255, 0.008)";
        this.context.beginPath();
        this.context.arc( this.get_position().x, this.get_position().y, this.size, 0, Math.PI*2, true);
        this.context.closePath();
        this.context.fill();
    };

    this.set_direction = function() {
        // make it go on differnt direction
        if( Math.floor( Math.random() * 2 ) ) {
            this.animX *= -1;
        }
    };

    this.animate = function() 
    {
        if( Math.ceil( Math.random() * 20 ) == 20  ) {
            this.set_direction(); // allow direction to change when comming from top again
        }
        this.set_position( this.get_position().x + this.animX,
                           this.get_position().y + this.animY );

        if( this.get_position().x > this.boundaries.x || this.get_position().x < 0  ||
            this.get_position().y > this.boundaries.y ) 
        {
                this.restore();
                this.set_direction(); // allow direction to change when comming from top again
        }

        this.redraw();
    };

    this.create = function() {
           //var x = Math.floor( Math.random() * this.boundaries.x ),
            //   y = Math.ceil( this.size / 2 );
               //y = Math.ceil( this.size / 2 );
            var x = 200,
                y = 20;

           this._position.x = x;
           this._position.y = y;

           self.set_size( 1 );
           self.set_position( x, y ); // initial position 10 starts on top
           self.redraw();
    };

    (function(){
        self.set_direction();
    })();
}

function init()
{
    var snow = new Snow(); 
    var canvas = snow.generate_canvas( document.getElementById('canvasdiv'),
                         document.getElementById('canvas') );

    snow.addParticle( canvas.getContext('2d') );
                         
}
