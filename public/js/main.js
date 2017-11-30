
$(window).load(function () { // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow': 'visible'});
})
$(document).ready(function () {
	var apiCalled = false;
    var isLocal = false;
    var apiEndPoint ="";
    var userObj = JSON.parse(localStorage.getItem('userObj'));
    console.log("local storage",localStorage);

    if(window.location.hostname == "localhost"){
        apiEndPoint = "http://localhost:3000/";
    }else{
        apiEndPoint = window.location.origin+window.location.pathname;
    }
	
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
                case(hash.indexOf('listing') == '0'):
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
    		$.ajax({url:apiEndPoint+searchUrl, success: function(response){
            console.log('api called result',response);
            apicalled = false;
            $('#uiView').load("./public/pages/searchListings.html", function(){

                $('#ListingPageSearchBtn').click(function(){
                
                    searchListings();

                })
                $('#addBodyContent').attr("style","display:none;");
                
                for(var i=0; i < response.length; i++){
                    var template = $('#searchListingTemplate').clone();
                    var searchIdx = "searchListingTemplate"+i;
                    template.attr('id',searchIdx);
                    console.log("response[i]",template.find("#listingPrice"));
                    template.attr("data",response[i].listing_id);
                    template.attr("class","view-listing-details col-sm-6 col-md-4");
                    template.find('#listingId')[0].innerHTML = response[i].listing_id;
                    template.find("#listingTitle")[0].innerHTML = response[i].title;
                    template.find("#listingArea")[0].innerHTML = response[i].area+"m2";
                    template.find("#listingPrice")[0].innerHTML = response[i].price+"EUR";
                    template.find("#listingDescription")[0].innerHTML = response[i].description;
                     template.appendTo(".appendHere");
                }
                var listingDetailsLinks = document.getElementsByClassName("view-listing-details");
    
                for(var i=0;i < listingDetailsLinks.length;i++) {
                    listingDetailsLinks[i].addEventListener("click", function() {
                        var element = document.getElementById(this.id);
                        var idx = element.getAttribute("data");
                        getListingDetails(idx);
                    });
                }
            });
            var appnd = document.getElementById('appendHere');
        }});
    	
    };

    function getListingDetails(listingId){
       console.log("listingId",listingId);
        var url = window.location.href;
        window.location.hash = 'listing?listingId='+listingId;

        $.ajax({url: apiEndPoint+"listing?listingId="+listingId, success: function(response){
            console.log("response after listing details",response);
            $('#uiView').load("./public/pages/listingDetails.html", function(){
                $("#chatDiv").hide();
                $("#addBodyContent").attr("style","display:none;");
                var template = $("#listingDetailsDiv");
                var bidabble = "";
                console.log("template",template);
                template.find("#listingTitle")[0].innerHTML = response[0].title;
                template.find("#listingDescription")[0].innerHTML = response[0].description;
                template.find("#listingArea")[0].innerHTML = response[0].area+"m<sup> 2 </sup>";
                template.find("#listingBaths")[0].innerHTML = response[0].baths;
                template.find("#listingBeds")[0].innerHTML = response[0].beds;

                template.find("#listingAgentName")[0].innerHTML = response[0].agent_name;
                template.find("#listingAgentEmail")[0].innerHTML = response[0].agent_email;
                template.find("#listingAgentPhone")[0].innerHTML = response[0].agent_contact;
                template.find("#listingAgentAddress")[0].innerHTML = response[0].agent_address;
                if(userObj){
                    if(userObj.user_type == 1){
                        $("#contactBtn").show();
                       template.find("#listingTitleAdd")[0].innerHTML = response[0].address+", "+response[0].location+", "+response[0].city; 
                    }

                }else{
                        $("#contactBtn").attr("style","display:none;");
                        template.find("#listingTitleAdd")[0].innerHTML = response[0].city;
                    }

                //template.find("#listingTitleAdd")[0].innerHTML = response[0].city;
                

                template.find("#listingPrice")[0].innerHTML = response[0].price+"EUR";
                if(response[0].is_biddable == 0){
                    bidabble = "No";
                }else{
                    bidabble = "Yes";
                }
                template.find("#listingBiddable")[0].innerHTML = bidabble;

                $("#contactBtn").click(function(){
                    $("#chatDiv").show();

                    $("#sendMessageBtn").click(function() {
                        var message = $("#chatMessage").val();
                        $.ajax({
                            url: apiEndPoint+"user/message",
                            type: "POST",
                            data: {
                                message: message,
                                senderId: userObj.user_id,
                                listingId:response[0].listing_id,
                                receiverId:response[0].agent_id
                            },
                            success: function(data) {
                            console.log("message sent",data);
                            alert("Message Sent Successfully!");
                            },
                            error: function(data, status, er) {
                                console.log("Error",data);
                                alert("Oops! Something went Wrong!!");
                            }
                        });
                    })
                });





            });
            
        }});
    }; 

     $( "#header" ).load( "./public/pages/header.html", function() {
        //$('html, body').animate({scrollTop: '0px'}, 300);

        if(localStorage.length > 0){
            $("#loginButton").hide();
            $("#logoutButton").show();
            $("#dashboardTab").show();
        }else{
            $("#loginButton").show();
            $("#logoutButton").hide();
            $("#dashboardTab").hide();
        }

        $("#logoutButton").click(function() {
            console.log("in logut button");
            localStorage.removeItem("userObj");
            $("#loginButton").show();
            $("#logoutButton").hide();
            $("#dashboardTab").hide();
            window.location.href=apiEndPoint;
        })

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


        //Login Function

    $('#loginBtn').click(function()
        {
            logMeIn();
        });

    function logMeIn()
    {
        var emails = $('#loginEmail').val();
        var passwords = $('#loginPassword').val();
        console.log("Email is: "+ emails + "Password is:"+ passwords);

        // $.ajax({url: "/index.html?email=" + emails "&password=" + passwordS, success: function(response){
        // }});

        $.ajax({
            url: apiEndPoint+"user/login",
            type: "POST",
            data: {
                email: emails,
                password: passwords
            },
            success: function(data) {
            console.log("data after success login",data);
            if(data){
                localStorage.setItem('userObj', JSON.stringify(data[0]));
                alert("Login Successful!!");
                location.href=apiEndPoint+"index.html";
            }
              //  IF DATA IS NOT EMPTY
                //    localStorage.setItem('username', data.username);
                  //  REDIRECT TO INDEX.HTML
                //else

            },
            error: function(data, status, er) {
                alert("Login Failed!");
            }
        });
    }

    //SignUp Function
    $('#signUpForm').submit(function(event) {
        event.preventDefault();
        if(validateForm()) {
            var formData = new FormData(this);
            $.ajax({
                url: apiEndPoint + "signup",
                type: "post",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log(response);
                    alert("Successfully Signed Up. Please Login!");
                },
                error: function(response) {
                    if(response.responseJSON.error === "ER_DUP_ENTRY"){
                        $('#emailError').removeClass('hide').text("Email address already exists.");
                        $('#email').focus();
                    } else {
                        alert("Error occured. Please try again later");
                    }
                }
            });
        }
    });

    // Validates sign up form fields
    function validateForm() {
        var regName = $('#name').val();
        var regEmail = $('#email').val();
        var regPsw = $('#password').val();
        var rptPass = $('#rptPass').val();
        var contact = $('#contact').val();
        var addr = $('#addr').val();

        var formValidation = true;

        if(regName === undefined || regName === '') {
            $('#nameError').removeClass('hide').text("required");
            formValidation = false;
        } else {
            $('#nameError').addClass('hide');
        }

        if(regEmail === undefined || regEmail === '') {
            $('#emailError').removeClass('hide').text("required");
            formValidation = false;
        } else if( !validateEmail(regEmail)){
            $('#emailError').removeClass('hide').text("Incorrect Format");
            formValidation = false;
        } else {
            $('#emailError').addClass('hide');
        }

        if(regPsw === undefined || regPsw === '') {
            $('#passError').removeClass('hide').text("required");
            formValidation = false;
        } else{
            $('#passError').addClass('hide');
        }

        if(rptPass === undefined || rptPass === '') {
            $('#rpError').removeClass('hide').text("required");
            formValidation = false;
        } else{
            $('#rpError').addClass('hide');
        }

        if(regPsw !== rptPass) {
            $('#rpError').removeClass('hide').text("Password and Confirm Password did not match");
            formValidation = false;
        } else{
            $('#rpError').addClass('hide');
        }

        return formValidation;
    }

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


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
