
$(window).load(function () { // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow': 'visible'});
})
$(document).ready(function () {
	var apiCalled = false;
    var isLocal = true;
    var apiEndPoint ="";
    var userObj = JSON.parse(localStorage.getItem('userObj'));
    console.log("userObj",userObj);
    if(userObj.user_type !== 1){
        var dashboardType="customer"; 
    }else {
        var dashboardType="agent"; 
    }
    if(isLocal){
        apiEndPoint = "http://localhost:3000/";
    }else{
        apiEndPoint = window.location.origin+window.location.pathname;
    }


    window.location.hash = "dashboard?type="+dashboardType;
	
	$(window).on('hashchange', function(){
        
        if(location.hash){
            
            hash = location.hash.substring(1);
            console.log('parameters present', hash.indexOf('agent'));
            // var params = hash.split('&');
           
            switch(true){
                case(hash.indexOf('customer') == '15'):
                    console.log('customer');
                    if(!apiCalled){
                    	customerDashboard();
                    }
                    break;
                case(hash.indexOf('agent') == '15'):
                        agentDashboard();
                    break;
                // default:
                //     console.log('profile');
                //     $("#uiView").load("./public/pages/profile.html", function(){
                //     });
            };
        }
    }).trigger('hashchange');

    //Customer Dashboard
    function customerDashboard(){
        $( "#uiView" ).load( "../pages/customerDashboard.html", function() {
            customerInbox();
            $('#cusInboxBtn').click(function() {
                $('#navInbox').attr("class","active");
                $('#navRL').attr("class","inActive");
               document.getElementById("navProfile").classList.remove("active");

               customerInbox();

            });
            $('#cusRLBtn').click(function() {
                $('#navInbox').attr("class","inActive");
                $('#navRL').attr("class","active");
                document.getElementById("navProfile").classList.remove("active");
               customerRequestListing();
            });
            $('#cusProfileBtn').click(function() {
                $('#navInbox').attr("class","inActive");
                $('#navRL').attr("class","inActive");
                document.getElementById("navProfile").classList.add("active");
                customerProfile();
            });
        });
    };
    

    //Customer Inbox tab
    function customerInbox(){
        console.log("inside inbox functiojjkjhhjjjhn");
        $('#customerInbox').attr("style","display:block;visiblity:visible;");
        $("#customerRfl").attr("style","display:none;");
        $("#customerProfile").attr("style","display:none;");

    }
    //Customer Requesting Listing
    function customerRequestListing(){
        console.log("inside requestListing function");
        $("#customerRfl").attr("style","display:block;");
        $("#customerInbox").attr("style","display:none;");
        $("#customerProfile").attr("style","display:none;");
    }
    //Customer Profile
    function customerProfile(){
        $("#customerProfile").attr("style","display:block;");
        $("#customerInbox").attr("style","display:none;");
        $("#customerRfl").attr("style","display:none;");
    }



    //Agent Dashboard 
    function agentDashboard(){
        $( "#uiView" ).load( "../pages/agentDashboard.html", function() {
        
            agentInbox();
            $('#agentInboxBtn').click(function() {

                $('#navInbox').attr("class","active");
                $('#navMl').attr("class","inActive");
                $('#navPl').attr("class","inActive");
               document.getElementById("navProfile").classList.remove("active");
               agentInbox();
            });
            $('#agentMlBtn').click(function() {
                $('#navInbox').attr("class","inActive");
                $('#navMl').attr("class","active");
                $('#navPl').attr("class","inActive");
               document.getElementById("navProfile").classList.remove("active");
                agentManageListing();
            });

            $('#agentPlBtn').click(function() {
                $('#navInbox').attr("class","inActive");
                $('#navMl').attr("class","inActive");
                $('#navPl').attr("class","active");
               document.getElementById("navProfile").classList.remove("active");
               agentPostListing();
            });

            $('#agentProfileBtn').click(function() {
                $('#navInbox').attr("class","inActive");
                $('#navMl').attr("class","inActive");
                $('#navPl').attr("class","inActive");
                document.getElementById("navProfile").classList.add("active");
                agentProfile();
            });
        });

    }

    //agent Inbox tab
    function agentInbox(){
        $('#agentInbox').attr("style","display:block;visiblity:visible;");
        $("#agentrMl").attr("style","display:none;");
        $("#agentPl").attr("style","display:none;");
        $("#agentProfile").attr("style","display:none;");

        //api call to get all the messages
        $.ajax({url:"../js/testmessages.json", success: function(response){
            console.log("response",response);
            for(var i=0;i < response.length;i++) {
                var template = $('#chatListItemTemplate').clone();
                template.attr("class","list-group-item");
                template.attr("data",response[i].id);
                template.attr("id","chatItem"+i);
                template.find(".chatItemText")[0].innerHTML = response[i].name;
                template.attr("style","dsiplay:block;");
                template.appendTo("#appendChatList");
            }
            var chatListingLinks = document.getElementsByClassName("list-group-item");
            console.log("chatListingLinks",chatListingLinks);
            for(var i=0;i < chatListingLinks.length;i++) {
                chatListingLinks[i].addEventListener("click", function() {
                    var element = document.getElementById(this.id);
                    var idx = element.getAttribute("data");
                    getChatDetails(idx,response);
                   // getListingDetails(idx);

                });
            }
            
            function getChatDetails(idx,response){
                var chatListingLinks = document.getElementsByClassName("list-group-item");
                 for(var i=0;i < chatListingLinks.length;i++) {
                    if(idx == i){
                        chatListingLinks[i].classList.add("active");  
                    }else{
                        chatListingLinks[i].classList.remove("active");
                    }
                    
                 }
                console.log("idx",idx,document.getElementById("chatDetails"));
                document.getElementById("chatDetails").innerHTML = response[idx].message;
            }
        }
        });
    }
    //agent Manage Listing
    function agentManageListing(){
        //temp*--- calling search api for data, replace with actual api call 
        var searchUrl = "search?city=fulda"+"&location="; 
        $.ajax({url:apiEndPoint+searchUrl, success: function(response){
            console.log("response in Agent Ml ",response);
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
                template.appendTo("#appendListings");
            }
            var listingDetailsLinks = document.getElementsByClassName("view-listing-details");
    
            for(var i=0;i < listingDetailsLinks.length;i++) {
                listingDetailsLinks[i].addEventListener("click", function() {
                    var element = document.getElementById(this.id);
                    var idx = element.getAttribute("data");
                    getListingDetails(idx);
                });
            }
        }});
            var appnd = document.getElementById('appendHere');

        $('#agentMl').attr("style","display:block;visiblity:visible;");
        $("#agentInbox").attr("style","display:none;");
        $("#agentPl").attr("style","display:none;");
        $("#agentProfile").attr("style","display:none;");
    }
    //agent Profile
    function agentProfile(){
        $('#agentProfile').attr("style","display:block;visiblity:visible;");
        $("#agentMl").attr("style","display:none;");
        $("#agentPl").attr("style","display:none;");
        $("#agentInbox").attr("style","display:none;");
    }
    // agent Post Listing
    function agentPostListing(){
        $('#agentPl').attr("style","display:block;visiblity:visible;");
        $("#agentMl").attr("style","display:none;");
        $("#agentInbox").attr("style","display:none;");
        $("#agentProfile").attr("style","display:none;");
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
