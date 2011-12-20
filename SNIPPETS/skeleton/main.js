/*
 * Mitermayer Reis
 * mitermayer.reis@gmail.com
 * -----------------------------------------------------
 * Skeleton frame for canvas animations and experiments
 * version: 0.1  ----- 20/12/2011
 * -----------------------------------------------------
 */
window.onload = init;

var Helper = {
    match_probability: function( percentage ) {
        return Math.ceil( Math.random() * Math.ceil( 100/percentage ) ) == Math.ceil( 100/percentage ); 
    }
};

function Anim( options )
{
    var self = this;

    this.numParticles = 1; // sets how many animated item will exist
    this.particles = [];
    this.running_animation = null;
    this.mousePos = { X: null, Y: null };

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

    this.addParticle = function( context, position ) 
    {
        for( var i=0; i<this.numParticles; i++ ) 
        {
           var p = new Particle( context, { x: self.width, y: self.height } ); 
           if( position ) {
               p.create( position.X, position.Y );
           } else {
               p.create();
           }
           self.particles[self.particles.length] = p; 
        }
    }

    function loopAnimation()
    {
        self.running_animation = window.setInterval( callAnimation, 50 );
    }

    function callAnimation()
    {
        eraseCanvas();
        var NP = self.particles.length;
        for( var i=0; i<NP; i++ ) 
        {
            self.particles[i].animate();
        }
    }

    function eraseCanvas()
    {
        self.canvas.width = self.width;
    }

    function restart( event )
    {
        // Makes default to first instantiation
        self.particles = [];
        self.addParticle( self.canvas.getContext("2d"), self.mousePos );
    }    

    function update_position( event )
    {
        self.mousePos = { X: ( event.clientX - self.canvas.offsetLeft ) + window.scrollX, 
                          Y: ( event.clientY - self.canvas.offsetTop ) + window.scrollY };
    }

    function events()
    {
        window.addEventListener("click", restart, false );
        window.setInterval( restart, 1500 );
    }

    (function(){
        self.generate_canvas( options.container_parent, options.container );
        restart(); // draw item at least once
        events(); // setup events 
        loopAnimation(); // call main loop
    })();
}

function CanvasOB( context )
{
    this.context = context;
    this.size = 10;
    this.position = { x: 0, y: 0 };
    this._position = {};

    this.redraw  = function() { };

    this.restore = function()
    {
        this.set_position( this._position.x, this._position.y );    
    };

    this.get_position  = function()
    {
        return this.position; 
    };

    this.set_position  = function( x, y )
    {
        this.position.x = x; 
        this.position.y = y; 
    };

    this.set_size = function( size )
    {
        this.size = size; 
    };

    this.clearObj = function() {
        
    };
}

function Particle( context, boundaries ) 
{
    var self = this;
    this.__proto__ = new CanvasOB( context );
    this.boundaries = boundaries;

    this.redraw = function( x, y, size ) {

        this.context.fillStyle = "#fff";
        this.context.beginPath();
        this.context.arc( this.get_position().x, this.get_position().y, this.size, 0, Math.PI*2, true);

        /*
        // add stroke
        this.context.lineWidth = 2;
        this.context.strokeStyle = "rgba( 255, 255, 255, 0.7)";
        this.context.stroke();

        // add shadow
        this.context.shadowOffsetX = 2;
        this.context.shadowOffsetY = 2;
        this.context.shadowBlur = 3;
        this.context.shadowColor = "rgba(255, 255, 255, 0.6)";
        */

        this.context.closePath();
        this.context.fill();

    };

    this.outsideCanvas = function() 
    {
        return this.get_position().x > this.boundaries.x || this.get_position().x < 0  || this.get_position().y > this.boundaries.y;
    }

    this.animate = function() 
    {
        // change state of the animation in here so 
        // that it will be updated in each frame
        this.redraw();
    };

    this.create = function( optX, optY )
    {
            // default is center
            var x = optX || ( (self.boundaries.x / 2) - (self.size / 2) ),
                y = optY || ( (self.boundaries.y / 2) - (self.size / 2) );
                //y = self.boundaries.y - self.size;

           this._position.x = x;
           this._position.y = y;

           self.set_position( x, y ); 
           self.redraw();
    };

    (function(){
        // call any init methods in here 
    })();
}

function init()
{
    var anim = new Anim({
        container_parent: document.getElementById('canvasdiv'), 
        container: document.getElementById('canvas')
    }); 
}
