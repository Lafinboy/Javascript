window.onload = init;


var Helper = {
    match_probability: function( percentage ) {
        return Math.ceil( Math.random() * Math.ceil( 100/percentage ) ) == Math.ceil( 100/percentage ); 
    }
};

function Smoke( options )
{
    var self = this;

    this.numParticles = 200;
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
           p.create( position.X, position.Y );
           this.particles[this.particles.length] = p; 
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

    function mouse_pos( event )
    {
        self.mousePos = { X: ( event.clientX - self.canvas.offsetLeft ) + window.scrollX, 
                          Y: ( event.clientY - self.canvas.offsetTop ) + window.scrollY };

        self.particles = [];
        self.addParticle( self.canvas.getContext("2d"), self.mousePos ); 
    }    

    function events()
    {
        window.addEventListener("click", mouse_pos, false );
    }

    (function(){
        events(); 
        loopAnimation();
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
    this.animX = Math.ceil( Math.random() * 6 );
    this.animY = Math.ceil( Math.random() * 20 ) + 15;
    this.animSize = 8;
    this.maxSize = 150;

    this.opa = 0.090;
    this.animOpa = 0.0035;

    this.redraw = function( x, y, size ) {

        if( !self.opa ) { return;  }

        if( Helper.match_probability(33) ) {
            self.set_size( self.grow( self.size, self.maxSize, self.animSize ) );
        }

        self.opa = self.fade( self.opa, self.animOpa );

        this.context.fillStyle = "rgba( 255, 255, 255, " + self.opa + ")";
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


    this.fade = function( opacity, rate )
    {
        return opacity - rate > 0 ? opacity - rate : 0;
    };

    this.grow = function( size, maxSize, rate )
    {
        var gr = rate || 1;
        return ( size < maxSize ) ? size + gr : size;
    };

    this.set_direction = function()
    {
        // make it go on differnt direction
        if( Helper.match_probability(50) ) {
            this.animX *= -1;
        }
    };

    this.outsideCanvas = function() 
    {
        return this.get_position().x > this.boundaries.x || this.get_position().x < 0  || this.get_position().y > this.boundaries.y;
    }

    this.animate = function() 
    {
        if( Helper.match_probability(5) ) {
            this.set_direction(); // allow direction to change when comming from top again
        }
        this.set_position( this.get_position().x + this.animX,
                           this.get_position().y - this.animY );

        if( self.outsideCanvas() ) 
        {
                this.restore();
                this.set_direction(); // allow direction to change when comming from top again
        }

        this.redraw();
    };

    this.create = function( optX, optY )
    {
            var x = optX || self.boundaries.x / 2,
                y = optY || self.boundaries.y - self.maxSize;
                //y = self.boundaries.y - self.size;

           this._position.x = x;
           this._position.y = y;

           self.set_size( 1 ); // start with the smallest size
           self.set_position( x, y ); // initial position 10 starts on top
           self.redraw();
    };

    (function(){
        self.set_direction();
    })();
}

function init()
{
    var smoke = new Smoke(); 
    var canvas = smoke.generate_canvas( document.getElementById('canvasdiv'),
                         document.getElementById('canvas') );

}
