// Dirty hack to keep shared code functional
var Perlin = Perlin;
if ( typeof require == "function" ){ Perlin = require("../shared/perlinnoise.js") }

// enum
var TotemTypes = {
	empty : 0,
	settlement : 1,
	forest : 2,
	residential : 3,
	mine : 4,
	rocky : 5,
	petrol : 6,
	nuclearplant : 7,
	launchsite : 8,
	house1 : 9,
	lumber1 : 10,
	cannon: 11,
};


var Generator = {
	
	scale : 2,
	octaves : 5,
	persistance : 0.5,
	ampltitude : 400,

	CHUNK_SIZE : 16,

	WORLD_WIDTH_IN_CHUNKS : 5,
	WORLD_HEIGHT_IN_CHUNKS : 5,

	WORLD_WIDTH: 5*16,
	WORLD_HEIGHT: 5*16,

	generateTerrain : function ( seed ) {
		
		Perlin.setSeed(seed);
		
		WORLD_WIDTH = this.CHUNK_SIZE * this.WORLD_WIDTH_IN_CHUNKS;
		WORLD_HEIGHT = this.CHUNK_SIZE * this.WORLD_HEIGHT_IN_CHUNKS;
		
		let heightmap = [];
		let max = 0;
		let min = 1;

		for (let x = 0; x < this.WORLD_WIDTH; x++) {
		  for (let y = 0; y < this.WORLD_HEIGHT; y++) {
			let value = Math.abs(Perlin.OctavePerlin(x*this.scale / this.WORLD_WIDTH, y*this.scale / this.WORLD_HEIGHT,this.octaves,this.persistance));
			if ( value > max ) { max = value }
			if ( value < min ) { min = value }
		  }
		}

		for (let x = 0; x < this.WORLD_WIDTH; x++) {
			heightmap[x] = [];
		  for (let y = 0; y < this.WORLD_HEIGHT; y++) {
			  
			let value = Perlin.OctavePerlin( x*this.scale / this.WORLD_WIDTH, y*this.scale / this.WORLD_HEIGHT,this.octaves,this.persistance);
			value = (value-min)*(1/(max-min)) // normalizing to 0.0 - 1.0
			
			// Next, one of the masks below is applied to the perlin noise to generate some sort of terrain :
			
			// Chebyshev distance -> square gradient
			//value *= ( Math.max  ( Math.abs((x-WORLD_WIDTH/2)/(WORLD_WIDTH/2) ), ( Math.abs(y-WORLD_HEIGHT/2)/(WORLD_HEIGHT/2) ) ) );
			
			
			// S-curve and a factor -> generates spare islands
			//value = Perlin.fade(value);
			
			// Manhattan distance -> diamond gradient
			//value *= ( ( Math.abs(x-WORLD_WIDTH/2)/(WORLD_WIDTH/2) ) + ( Math.abs(y-WORLD_HEIGHT/2)/(WORLD_HEIGHT/2) ) )
			
			// Euclidean distance -> circular gradient
			//value *= Math.sqrt( (x-WORLD_WIDTH/2)*(x-WORLD_WIDTH/2) + (y-WORLD_HEIGHT/2)*(y-WORLD_HEIGHT/2) ) / (WORLD_WIDTH+WORLD_HEIGHT)*8;

			//value *= 256;
			//value = 1-value;
			value *= this.ampltitude;
			
			// Water flicker fix
			if ( Math.abs ( value - 175 ) <= 10 ){ value = value-value%5; }
			
			heightmap[x][y] = value;    
		  }
		}
		
		//console.log(max)
		//console.log(min)
		
		return heightmap;
	},
	
	generateTotemMap : function ( heightmap, seed ) {
		
		Perlin.setSeed(seed);
		
		let totems = [];

		for (let x = 0; x < this.WORLD_WIDTH; x++) {
			totems[x] = [];
		  for (let y = 0; y < this.WORLD_HEIGHT; y++) {
			  totems[x][y] = TotemTypes.empty;
			if ( heightmap[x][y] > 200 ){
				if ((Perlin.hashing_PRNG() * 0.5) + 0.5 <= 1.0/18.0 )
					totems[x][y] = TotemTypes.forest;
				else if ((Perlin.hashing_PRNG() * 0.5) + 0.5 <= 1.0 / 10)
					totems[x][y] = TotemTypes.rocky;
			}
		  }
		}
		
		return totems;
	}


}

// shared code hotfix
var module = module;
if ( typeof module == "object" ){
module.exports = Generator;
}