//-- Sample Unit Test
//-- Farzaneh Sabzi

var expect = require ('chai').expect;
var listing = require('../core/listing.js');
var assert = require ('chai').assert;

describe ('getListings()' , function(){
  it('Return listings', function(done){
	//arrange
	
	//act
	var result;
	listing.getListings("", "", function (err, data) {
            result=data;
	    console.log(data);
	    done();	
        });

	//assert
	assert.isNotNull(result,' Data from listing is not empty');
  });	
});

