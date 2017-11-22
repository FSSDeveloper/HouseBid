
$(window).load(function () { // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow': 'visible'});
})
$(document).ready(function () {
	var apiCalled = false;
	
	$(window).on('hashchange', function(){
        
        if(location.hash){
            
            hash = location.hash.substring(1);
            console.log('parameters present', hash.indexOf('search'));
            // var params = hash.split('&');
           
            switch(true){
                case(hash.indexOf('search') == '0'):
                    console.log('search');
                    if(!apiCalled){
                    	searchListings();
                    }

                    break;
                case(hash.indexOf('listingId') == '0'):
                    console.log('listingId');

                    getListingDetails(hash.split('=')[1]);
                    break;
                default:
                    console.log('home');
                    $("#uiView").load("./public/pages/homeContent.html", function(){
                    });
            };
        }else if(location.pathname == '/index.html'){

          loadHomePage();
            
        }
    }).trigger('hashchange');

    function loadHomePage(){
        $( "#header-content" ).load( "partials/_header.html", function() {
        //$('html, body').animate({scrollTop: '0px'}, 300);
            window.scrollTo(0, 0);
        });
        $( "#footer-content" ).load( "partials/_footer.html", function() {
        
        });
        console.log($('.homeImage'));
        // $('.homeImage').attr('src','./public/images/slide1/slider-image-1.jpg');

        $("#loadSliderContent").load("./public/pages/homeSlider.html", function(){
        	console.log('inside loadHomePage');
            $('#addBodyContent').attr("style","background-color: #FCFCFC; padding-bottom: 15px;display:block;visibility:visible;");
        	$('#homeSlider').attr('style','display:block;visibility:visible;');
           
            $('#homeSearchBtn').click(function(){
                
                searchListings();

            })
        });
    }

    loadHomePage();
    

    function searchListings(){
    	apiCalled = true;
    		var searchLocation = $('#searchLocation').val();
            console.log("searchLocation",searchLocation);
                var city = $('#city').val();
                console.log("city",city,"location",location);
                var url = window.location.href;
                if(city || searchLocation){
                	window.location.hash = "search?city="+city+"&location="+searchLocation;
                	var searchUrl = "search?city="+city+"&location="+searchLocation;
                }else if(location.hash){
                	var hash = location.hash.substring(1);
                	var searchUrl = hash;
                }
    		$.ajax({url:"/"+searchUrl, success: function(response){
            console.log('api called result',response);
            apicalled = false;
            $('#uiView').load("./public/pages/searchListings.html", function(){
                $('#addBodyContent').attr("style","display:none;");
                
                for(var i=0; i < response.length; i++){
                    var template = $('#searchListingTemplate').clone();
                    var searchIdx = "searchListingTemplate"+i;
                    template.attr('id',searchIdx);
                    console.log("response[i]",template.find("#listingPrice"));
                    template.attr('style',"display:block;visibility:visible;margin:10px;");
                    template.find('#listingId')[0].innerHTML = response[i].listing_id;
                    template.find("#listingTitle")[0].innerHTML = response[i].title;
                    template.find("#listingArea")[0].innerHTML = "500m2";
                    template.find("#listingPrice")[0].innerHTML = response[i].price+"EUR";
                    template.find("#listingDescription")[0].innerHTML = response[i].description;
                     template.appendTo(".appendHere");
                }
            });
            var appnd = document.getElementById('appendHere');
        }});
    	
    };

    function getListingDetails(val){
       
        var url = window.location.href;
        window.location.hash = '?listingId='+val;

        $.ajax({url: "/listings.json", success: function(response){
            
            $('#body-content').load("partials/_single.html", function(){
                
                
            });
        }});
    }; 
    
   $( "#header" ).load( "./public/pages/header.html", function() {
        //$('html, body').animate({scrollTop: '0px'}, 300);
        window.scrollTo(0, 0);
    });
    
    $( "#footer" ).load( "./public/pages/footer.html", function() {
        
    });

    
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-yellow',
        radioClass: 'iradio_square-yellow',
        increaseArea: '20%' // optional
    });


    $('.layout-grid').on('click', function () {
        $('.layout-grid').addClass('active');
        $('.layout-list').removeClass('active');

        $('#list-type').removeClass('proerty-th-list');
        $('#list-type').addClass('proerty-th');

    });

    $('.layout-list').on('click', function () {
        $('.layout-grid').removeClass('active');
        $('.layout-list').addClass('active');

        $('#list-type').addClass('proerty-th-list');
        $('#list-type').removeClass('proerty-th');

    });

});
$(document).ready(function () {
    $("#bg-slider").owlCarousel({
        navigation: false, // Show next and prev buttons
        slideSpeed: 100,
        autoPlay: 5000,
        paginationSpeed: 100,
        singleItem: true,
        mouseDrag: false
                // "singleItem:true" is a shortcut for:
                // items : 1, 
                // itemsDesktop : false,
                // itemsDesktopSmall : false,
                // itemsTablet: false,
                // itemsMobile : false 
    });
    $("#prop-smlr-slide_0").owlCarousel({
        navigation: false, // Show next and prev buttons
        slideSpeed: 100,
        pagination: true,
        paginationSpeed: 100,
        items: 3

    });
    $("#testimonial-slider").owlCarousel({
        navigation: false, // Show next and prev buttons
        slideSpeed: 100,
        pagination: true,
        paginationSpeed: 100,
        items: 3
    });

    $('#price-range').slider();
    $('#property-geo').slider();
    $('#min-baths').slider();
    $('#min-bed').slider();

    var RGBChange = function () {
        $('#RGB').css('background', '#FDC600')
    };

    // Advanced search toggle
    var $SearchToggle = $('.search-form .search-toggle');
    $SearchToggle.hide();

    $('.search-form .toggle-btn').on('click', function (e) {
        e.preventDefault();
        $SearchToggle.slideToggle(300);
    });

    setTimeout(function () {
        $('#counter').text('0');
        $('#counter1').text('0');
        $('#counter2').text('0');
        $('#counter3').text('0');
        setInterval(function () {
            var curval = parseInt($('#counter').text());
            var curval1 = parseInt($('#counter1').text().replace(' ', ''));
            var curval2 = parseInt($('#counter2').text());
            var curval3 = parseInt($('#counter3').text());
            if (curval <= 1007) {
                $('#counter').text(curval + 1);
            }
            if (curval1 <= 1280) {
                $('#counter1').text(sdf_FTS((curval1 + 20), 0, ' '));
            }
            if (curval2 <= 145) {
                $('#counter2').text(curval2 + 1);
            }
            if (curval3 <= 1022) {
                $('#counter3').text(curval3 + 1);
            }
        }, 2);
    }, 500);

    function sdf_FTS(_number, _decimal, _separator) {
        var decimal = (typeof (_decimal) != 'undefined') ? _decimal : 2;
        var separator = (typeof (_separator) != 'undefined') ? _separator : '';
        var r = parseFloat(_number)
        var exp10 = Math.pow(10, decimal);
        r = Math.round(r * exp10) / exp10;
        rr = Number(r).toFixed(decimal).toString().split('.');
        b = rr[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1" + separator);
        r = (rr[1] ? b + '.' + rr[1] : b);

        return r;
    }

})

// Initializing WOW.JS

new WOW().init();
