//Author- Vijay Bhaskar Puttamshetty 
$(window).load(function () { // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow': 'visible'});
})
$(document).ready(function () {
    function hideToaster(){
        $("#toaster-success").fadeOut(5000);
        $('#toaster-fail').fadeOut(5000);
    };
	var apiCalled = false;
    var isLocal = false;
    var apiEndPoint ="";
    var sortByDateBtn = false;
    var sortByPriceBtn = false;
    var counterForOptions = 0;
    if(localStorage.length > 0){
        var userObj = JSON.parse(localStorage.getItem('userObj'));
    }else{
        var userObj ={};
    }
    console.log("local storage",localStorage);

    if(window.location.hostname == "localhost"){
        apiEndPoint = "http://localhost:3000/";
    }else{
        apiEndPoint = "https://www.sfsuse.com/fa17g20/";
    }
	
	$(window).on('hashchange', function(){
        if(location.hash){
            hash = location.hash.substring(1);
            switch(true){
                case(hash.indexOf('search') == '0'):
                    console.log('search',apiCalled);
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
                    $("#uiView").load("./pages/homeContent.html", function(){
                    });
            };
        }else if(location.pathname == '/index.html'){

          loadHomePage(); 
        }
    }).trigger('hashchange');

    function loadHomePage(){

        $("#loadSliderContent").load("./pages/homeSlider.html", function(){
        	console.log('inside loadHomePage');
            $('#addBodyContent').attr("style","background-color: #FCFCFC; padding-bottom: 15px;display:block;visibility:visible;");
        	$('#homeSlider').attr('style','display:block;visibility:visible;');
           
            $('#homeSearchBtn').click(function(){          
                searchListings();
            })
        });
    }

    loadHomePage();

    // Cities AJAX
        // $.ajax({
        //     url: apiEndPoint+"listing/cities",
        //     type: "get",
        //     success: function(data) {
        //        data.forEach(function(element){
        //             $('#city').append($('<option>', {         
        //              text: element.City           
        //             }));
        //         });
        //     },
        //     error: function(data, status, er) {
        //         console.log("Error while fetching cities.");
        //     }
        // });
    function searchListings(){
    	apiCalled = true;
        $('#status').fadeOut();
        $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
        //$('body').delay(350).css({'overflow': 'visible'});
        var city ="";
        var searchLocation = "";
		searchLocation = $('#searchLocation').val();
        city = $('#city').val();
        var bedNo = $("#searchBeds").val();
        var bathNo = $("#searchBaths").val();
        if(!bedNo && !bathNo){
            bedNo = "";
            bathNo = "";
        }
        console.log("city",city,"location",searchLocation);

        if(city || searchLocation || bedNo || bathNo){
        	window.location.hash = "search?city="+city+"&location="+searchLocation+"&bedNo="+bedNo+"&bathNo="+bathNo;
        	var searchUrl = "search?city="+city+"&location="+searchLocation+"&bedNo="+bedNo+"&bathNo="+bathNo;
        }else if(location.hash){
        	var hash = location.hash.substring(1);
        	var searchUrl = hash;
        }
        else if (city == ""){
                //$('#uiView').load("./pages/searchListings.html");
            window.location.hash = "search?city="+city+"&location="+searchLocation;
            var searchUrl = "search?city="+city+"&location="+searchLocation;
        }

            // For sorting/filter data
        var priceOrder = $($("#byPrice")[0]).attr("data-order");
        var dateOrder = $($("#byDate")[0]).attr("data-order");
        console.log("priceorder",priceOrder,dateOrder);

        if(priceOrder || dateOrder) {
            // var test = priceOrder;
            // var test2 =dateOrder;
            // console.log(test,test2); 
            if(priceOrder) {
                searchUrl += "&sortByPrice="+sortByPriceBtn+"&orderByPrice=" + priceOrder.toLowerCase();
            }
            if(dateOrder) {
                searchUrl += "&sortByDate="+sortByDateBtn+"&orderByDate=" + dateOrder.toLowerCase();
            }
        }

		$.ajax({url:apiEndPoint+searchUrl, success: function(response){
            console.log('api called result',response);
            apiCalled = false;
            counterForOptions = counterForOptions+1;
            $('#uiView').load("./pages/searchListings.html", function(){
                //$('#searchLocation').val("");
                 console.log(city,searchLocation,"debba");
                        $('#searchLocation').val(searchLocation);
                        $('#city').val(city); 
                        $("#searchBeds").val(bedNo);
                        $("#searchBaths").val(bathNo);

                    $.ajax({
                        url: apiEndPoint+"listing/cities",
                        type: "get",
                        success: function(data) {
                            data.forEach(function(element){
                                $('.cityPicker').append($('<option>', {         
                                    text: element.City           
                                }));
                            });
                            if($('#city').val()!== ""){

                             $('#city').val(city);
                            }
                        },
                        error: function(data, status, er) {
                            console.log("Error while fetching cities.");
                        }
                    });
                $("#byDate").click(function(){
                   sortByDateBtn = true;
                });
                $("#byPrice").click(function(){
                   sortByPriceBtn = true;
                });
                $("#resetFilter").click(function(){
                    $('#searchLocation').val("");
                        $('#city').val(""); 
                        $("#searchBeds").val("");
                        $("#searchBaths").val("");
                        window.location.hash = "search?city=&location=";
                    searchListings();
                })
                $('#ListingPageSearchBtn').click(function(){
                    searchListings();
                });
                $('#addBodyContent').attr("style","display:none;");
                if(response.length > 0){
                        for(var i=0; i < response.length; i++){
                            var template = $('#searchListingTemplate').clone();
                            var searchIdx = "searchListingTemplate"+i;
                            template.attr('id',searchIdx);
                            template.attr("data",response[i].listing_id);
                            template.attr("class","view-listing-details col-sm-6 col-md-4");
                            template.find('#listingId')[0].innerHTML = response[i].listing_id;
                            template.find("#listingTitle")[0].innerHTML = response[i].title;
                            template.find("#listingArea")[0].innerHTML = response[i].area+"m2";
                            template.find("#listingPrice")[0].innerHTML = response[i].price+"EUR";
                            template.find("#listingDescription")[0].innerHTML = response[i].description;      
                            template.find("#listingCity")[0].innerHTML = response[i].city;
                            template.find("#searchListingBeds")[0].innerHTML = response[i].beds;
                            template.find("#searchListingBaths")[0].innerHTML = response[i].baths; 
                            if(response[i].total_images > 0){
                                template.find("#searchListingImg")[0].innerHTML = "<img style='width:300px;height:248px;' src='"+apiEndPoint+"listing/image?listingId="+response[i].listing_id+"&number=1'>"; 
                            }else{
                              template.find("#searchListingImg")[0].innerHTML = "<img src=./images/demo/property-3.jpg>";  
                            }
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

                }else{
                    $(".appendHere").append("<h3 style='margin-left:20px;'> <i> No results Matching your criteria!</i> </h3>");
                }
                
            });
            var appnd = document.getElementById('appendHere');
        }});
    };


    function getListingDetails(listingId){
       
       console.log("listingId",listingId);
        //var url = window.location.href;
        window.location.hash = 'listing?listingId='+listingId;

        $.ajax({url:apiEndPoint+"listing?listingId="+listingId, success: function(response){
            console.log("response after listing details",response);
            $('#uiView').load("./pages/listingDetails.html", function(){
                $("#chatDiv").hide();
                $("#addBodyContent").attr("style","display:none;");
                var template = $("#listingDetailsDiv");
                var bidabble = "";
                console.log("template",template);
                template.find("#listingTitle")[0].innerHTML = response[0].title;
                template.find("#listingMetaTitle")[0].innerHTML = response[0].title;
                template.find("#listingDescription")[0].innerHTML = response[0].description;
                template.find("#listingAreaVal")[0].innerHTML = response[0].area+"m<sup> 2 </sup>";
                template.find("#listingGarageVal")[0].innerHTML = "2";
                template.find("#listingBaths")[0].innerHTML = response[0].baths;
                template.find("#listingBeds")[0].innerHTML = response[0].beds;
                template.find("#listingAreaVal")[0].innerHTML = response[0].area+"m2";
                template.find("#listingAgentPic")[0].innerHTML = "<img src="+apiEndPoint+"user/image?userId="+response[0].agent_id+"/>";
                template.find("#listingAgentName")[0].innerHTML = response[0].agent_name;
                template.find("#listingAgentEmail")[0].innerHTML = response[0].agent_email;
                template.find("#listingAgentPhone")[0].innerHTML = response[0].agent_contact;
                template.find("#listingAgentAddress")[0].innerHTML = response[0].agent_address;
                var imgArr = [];
                if(response[0].total_images > 0){
                    console.log("in if");
                    var str = "";
                    for(i = 1; i <= response[0].total_images;i++){
                        if(i == 1){
                            str =str + "<div class='item active'><img style='height: -webkit-fill-available;' src='"+apiEndPoint+"listing/image?listingId="+response[0].listing_id+"&number="+i+"'/></div>";
                      
                        }else{
                            str =str + "<div class='item'><img style='height: -webkit-fill-available;' src='"+apiEndPoint+"listing/image?listingId="+response[0].listing_id+"&number="+i+"'/></div>";
                        }
                        
                    }
                    document.getElementById("listingCarousalImg").innerHTML = str;
                }else{
                    console.log("in else");
                 document.getElementById("listingCarousalImg").innerHTML = "<div class='item active'><img src='./images/property-1/property1.jpg' alt='Los Angeles' style='width:100%;'></div><div class='item'><img src='./images/property-1/property3.jpg' alt='Chicago' style='width:100%;'></div>"+
                    "<div class='item'><img src='./images/property-1/property4.jpg' alt='New york' style='width:100%;'></div>";   
                }
                if(userObj){
                    if(userObj.user_type == 1){
                        $("#contactBtn").show();
                        $("#locationListing").show();
                        // var latitude = response[0].latitude;
                        // var longitude = response[0].longitude;

                        
                        $("#showLocation").attr("style","display:none;");

                       template.find("#listingTitleAdd")[0].innerHTML = " IN " +response[0].address+", "+response[0].location+", "+response[0].city; 
                       
                       var addr = response[0].address+", "+response[0].location+", "+response[0].city;
                        locateInMap(addr);
                        function locateInMap(address){
                            var address = address || 'Germany';
                            geocoder = new google.maps.Geocoder();
                            if (geocoder) {
                                geocoder.geocode({
                                    'address': address
                                }, function (results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                    
                                        document.getElementById('listingMapDiv').innerHTML = "<iframe src='https://maps.google.com/maps?q="+results[0].geometry.location.lat()+","+results[0].geometry.location.lng()+"&hl=es;z=14&amp;output=embed'></iframe>";

                                    }else{
                                        document.getElementById('listingMapDiv').innerHTML = "<iframe src='https://maps.google.com/maps?q=51.165691,10.451526000000058&hl=es;z=14&amp;output=embed'></iframe>";
                                    }
                                });
                            }else{
                                document.getElementById('listingMapDiv').innerHTML = "<iframe src='https://maps.google.com/maps?q=51.165691,10.451526000000058&hl=es;z=14&amp;output=embed'></iframe>";
                            }
                        }
                    }else{
                      $("#contactBtn").hide();  
                      $("#locationListing").show();
                      $("#showLocation").hide();
                    }
                }
                else{
                    $("#contactBtn").hide();
                    $("#locationListing").attr("style","display:none;");
                    $("#showLocation").show();
                    template.find("#listingTitleAdd")[0].innerHTML = response[0].city;
                }

                //template.find("#listingTitleAdd")[0].innerHTML = response[0].city;
                

                template.find("#listingPrice")[0].innerHTML = response[0].price+"EUR";


                $("#bidCount").attr("style, display:none;");

                if($("#bidNumber").val() > 1000)
                {
                    $("#bidCount").show();
                }
                else
                {
                    $("#bidCount").attr("style, display:none;");
                }
                if(response[0].is_biddable == 0){
                    bidabble = "No";
                    $("#bidNumber").attr("style","display:none;");

                }else{
                    if(userObj.user_type == 1){
                        template.find("#listingBiddableArea")[0].innerHTML = "<input  type='number' min='0' id='bidNumber' placeholder='Quote your Bid'><button class='contactDealerBtn' id='sendBidBtn' style='margin-top:10px;'>Send Quote </button>";
                         bidabble = "YES";
                     }else{
                        bidabble = "YES";
                     }
                   
                     
                    $("#bidNumber").show();
                }
                template.find("#listingBiddable")[0].innerHTML = bidabble;

                $("#contactBtn").click(function(){
                    $("#chatDiv").show();

                    $("#sendMessageBtn").click(function() {
                           var message = "<a href='../index.html#listing?listingId="+response[0].listing_id+"'>"+response[0].title+ "</a> :" + $("#chatMessage").val();

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
                            $("#toaster-success").show();
                            $("#chatMessage").val("");
                            document.getElementById("succesToasterData").innerHTML = "Message sent successful!";
                                setTimeout(function(){
                                  hideToaster();
                                }, 4000);
                            },
                            error: function(data, status, er) {
                            console.log("Error",data);
                            document.getElementById("failToasterData").innerHTML = "Oops! Something went Wrong!!";
                            $("#toaster-fail").show();
                            setTimeout(function(){
                              hideToaster();
                            }, 4000);
                            }
                        });
                    })
                });
                $("#sendBidBtn").click(function() {
                        var bidAmt = $("#bidNumber").val();
                        var  message= "I bid "+ bidAmt + " EUR for <a href='../index.html#listing?listingId="+response[0].listing_id+"'>"+response[0].title+ "</a>";
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
                            $("#toaster-success").show();
                            $("#bidNumber").val("");
                            document.getElementById("succesToasterData").innerHTML = "Message sent successful!";
                                setTimeout(function(){
                                  hideToaster();
                                }, 4000);
                            },
                            error: function(data, status, er) {
                            console.log("Error",data);
                            document.getElementById("failToasterData").innerHTML = "Oops! Something went Wrong!!";
                            $("#toaster-fail").show();
                            setTimeout(function(){
                              hideToaster();
                            }, 4000);
                            }
                        });
                    })

            });
            
        }});
    }; 

     $( "#header" ).load( "./pages/header.html", function() {
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
            window.location.href="./index.html";
        })

        window.scrollTo(0, 0);
    });
    
    $( "#footer" ).load( "./pages/footer.html", function() {
        
    });

    function sort() {
        $('#byPrice').click(function(event) {
            event.preventDefault();
            alert($($("#byPrice")[0]).attr("data-order"));
        });
    }

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
        $.ajax({
            url: apiEndPoint+"user/login",
            type: "POST",
            data: {
                email: emails,
                password: passwords
            },
            success: function(data) {
            console.log(data);
            console.log("data after success login",data);
            if(data.length > 0){
                localStorage.setItem('userObj', JSON.stringify(data[0]));
                $("#toaster-success").show();
                document.getElementById("succesToasterData").innerHTML = "Login Successful!";
                setTimeout(function(){
                  hideToaster();
                }, 4000);
                location.href="../"+"index.html";
            } else {
                document.getElementById("failToasterData").innerHTML = "Login Failed!";
                $("#toaster-fail").show();
                    setTimeout(function(){
                      hideToaster();
                    }, 4000);
            }
              //  IF DATA IS NOT EMPTY
                //    localStorage.setItem('username', data.username);
                  //  REDIRECT TO INDEX.HTML
                //else

            },
            error: function(data, status, er) {
                 $("#toaster-fail").show();
                 document.getElementById("failToasterData").innerHTML = "Login Failed";
                    setTimeout(function(){
                      hideToaster();
                    }, 4000);
            }
        });
    }

    //SignUp Function
    $('#signUpForm').submit(function(event) {
    
        event.preventDefault();
        
        if(validateForm()) {
            var formData = new FormData(this);
            $.ajax({
                url: apiEndPoint+"signup",
                type: "post",
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log(response);
                    $('#signUpForm').trigger("reset");
                    $("#toaster-success").show();
                    document.getElementById("succesToasterData").innerHTML = "SignUp Successful Please Login!";
                    setTimeout(function(){
                      hideToaster();
                    }, 4000);
                },
                error: function(response) {
                    if(response.responseJSON.error === "ER_DUP_ENTRY"){
                        $('#emailError').removeClass('hide').text("Email address already exists.");
                        $('#email').focus();
                    } else {
                        $("#toaster-fail").show();
                         document.getElementById("failToasterData").innerHTML = "Signup Failed Please try again";
                            setTimeout(function(){
                              hideToaster();
                            }, 4000);
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
            $('#rpError').removeClass('hide').text("Password and Repeat Password did not match");
            formValidation = false;
        } else{
            $('#rpError').addClass('hide');
        }

        return formValidation;
    }
        function ContactUsFormValidation(){
        var Cname = $('#name').val();
        var Cemail = $('#email').val();
        var Contact = $('#contact').val();
        var Csubject = $('#subject').val();
        console.log(Csubject);
        var formValidation = true;
        if(Cname === undefined || Cname === '') {
            $('#nameError').removeClass('hide').text("required");
            formValidation = false;
        } else {
            $('#nameError').addClass('hide');
        }
        
        if(Csubject === undefined || Csubject === '') {
            console.log('here');
            $('#subjectError').removeClass('hide').text("required");
            formValidation = false;
        } else {
            $('#subjectError').addClass('hide');
        }

        if(Cemail === undefined || Cemail === '') {
            $('#emailError').removeClass('hide').text("required");
            formValidation = false;
        } else if( !validateEmail(Cemail)){
            $('#emailError').removeClass('hide').text("Incorrect Format");
            formValidation = false;
        } else {
            $('#emailError').addClass('hide');
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
