//Author- Vijay Bhaskar Puttamshetty 
$(window).load(function () { // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow': 'visible'});
})
$(document).ready(function () {
    var apiCalled = false;
    var isLocal = false;
    var apiEndPoint ="";
    if(localStorage.length > 0){
        var userObj = JSON.parse(localStorage.getItem('userObj'));
    }else {
        var userObj ={};
    }

    console.log("userObj",userObj);
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
        localStorage.removeItem("userObj");
        $("#loginButton").show();
        $("#logoutButton").hide();
        $("#dashboardTab").hide();
        window.location.href="../";
    });
    if(userObj.user_type == 1){
        var dashboardType="customer"; 
    }else {
        var dashboardType="agent"; 
    }
    if(window.location.hostname == "localhost"){
        apiEndPoint = "http://localhost:3000/";
    }else{
        apiEndPoint = "https://www.sfsuse.com/fa17g20/";
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
                        
                    }
                    break;
                case(hash.indexOf('agent') == '15'):
                        
                    break;
            };
        }
    }).trigger('hashchange');

    if(userObj.user_type == 1){
        customerDashboard();
    }
    else{
        agentDashboard();
    }

    
    function hideToaster(){
        $("#toaster-success").fadeOut(5000);
        $('#toaster-fail').fadeOut(5000);
    };

    function getCustomerDashboardData(){
        customerInbox();
        customerRequestListing();
        customerProfile();
    }

    //Customer Dashboard
    function customerDashboard(){
        $( "#uiView" ).load( "../pages/customerDashboard.html", function() {
           getCustomerDashboardData();
           $('#customerInbox').attr("style","display:block;visiblity:visible;");
            $("#customerRfl").attr("style","display:none;");
            $("#customerProfile").attr("style","display:none;");

            $('#cusInboxBtn').click(function() {
                $('#navInbox').attr("class","active");
                $('#navRL').attr("class","inActive");
                document.getElementById("navProfile").classList.remove("active");
                $('#customerInbox').attr("style","display:block;visiblity:visible;");
                $("#customerRfl").attr("style","display:none;");
                $("#customerProfile").attr("style","display:none;");

            });
            $('#cusRLBtn').click(function() {
                $('#navInbox').attr("class","inActive");
                $('#navRL').attr("class","active");
                document.getElementById("navProfile").classList.remove("active");
                $("#customerRfl").attr("style","display:block;");
                $("#customerInbox").attr("style","display:none;");
                $("#customerProfile").attr("style","display:none;");
            });
            $('#cusProfileBtn').click(function() {
                $('#navInbox').attr("class","inActive");
                $('#navRL').attr("class","inActive");
                document.getElementById("navProfile").classList.add("active");
                $("#customerProfile").attr("style","display:block;");
                $("#customerInbox").attr("style","display:none;");
                $("#customerRfl").attr("style","display:none;");
            });
        });
    };
    

    //Customer Inbox tab
    function customerInbox(){
            $("#customerChatDetails").attr("style","display:none;");
            console.log("in customer inbox function");
            //api call to get all the messages
            var url ="user/messages?userId="+userObj.user_id;
            $.ajax({url:apiEndPoint+url, success: function(response){
                console.log("response",response);
                var currentChatObj = "";
                if(response.length > 0){
                    for(var i=0;i < response.length;i++) {
                        var template = $('#chatListItemTemplate').clone();

                        template.attr("class","list-group-item");
                        template.attr("data",i);
                        template.attr("id","chatItem"+i);
                        template.find(".chatItemText")[0].innerHTML = response[i][0].sender_name;
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

                        });
                    }
                }else{
                    document.getElementById('appendChatList').innerHTML = "<h3> <i> No messages here!!</i></h3>";
                }
                
                $("#newChatSendBtn").click(function() {

                   var newChatMsg = $("#newChatMessage").val();
                   console.log("current Object",currentChatObj,newChatMsg);
                   if(currentChatObj[0].listing_id !== userObj.user_id){
                    var receiver = currentChatObj[0].sender_id;
                   }
                   else{
                    var receiver = currentChatObj[0].receiver_id;
                   }
                   $.ajax({
                                url: apiEndPoint+"user/message",
                                type: "POST",
                                data: {
                                    message: newChatMsg,
                                    senderId: userObj.user_id,
                                    listingId:currentChatObj[0].listing_id,
                                    receiverId:receiver
                                },
                                success: function(response) {
                                newChatMsg = "";
                                $("#newChatMessage").val("");
                                var respArr = response;
                                currentChatObj = response;
                                var chatBoxTemplate = $("#chatBoxTemplate").clone();
                                if(userObj.user_id == response[0].sender_id){
                                    chatBoxTemplate.attr("style","border-radius: 8px 3px 3px 8px;padding: 5px;color: black;background-color: #dcf8c6;width:max-content;margin:10px;margin-left:auto;");
                                    //chatBoxTemplate.attr("class","pull-right")
                                    }else{
                                        chatBoxTemplate.attr("style","border-radius: 8px 3px 3px 8px;padding: 5px;color: black;background-color: #eef8f1;width:max-content;margin:10px;");    
                                      //  chatBoxTemplate.attr("class","pull-left");
                                    }
                                chatBoxTemplate.find("#chatMessage")[0].innerHTML = response[0].message;
                                chatBoxTemplate.appendTo("#chatDetails");
                                var chatDivHeight = document.getElementById("chatDetails").scrollHeight;
                                $('#chatDetails').animate({scrollTop:chatDivHeight}, 'slow');
                                },
                                error: function(data, status, er) {
                                    console.log("Error",data);
                                }
                            });

                })
                function getChatDetails(idx,response){
                        
                    currentChatObj = "";
                    $("#customerChatDetails").attr("style","display:block;");
                    document.getElementById("chatDetails").innerHTML = " ";
                    var chatListingLinks = document.getElementsByClassName("list-group-item");
                    for(var i=0;i < chatListingLinks.length;i++) {
                        if(idx == i){
                            chatListingLinks[i].classList.add("active");  
                        }else{
                            chatListingLinks[i].classList.remove("active");
                        }
                        
                     }
                    //$("#chatDetails").innerHTML = "";
                    $.ajax({
                        url: apiEndPoint+"user/conversation?senderId="+response[idx][0].sender_id+"&receiverId="+userObj.user_id,
                        type: "GET", // By default GET,
                        success: function(response) {
                            for(var x=0;x<response.length;x++){
                                var respArr = response;
                                currentChatObj = response;
                                var chatBoxTemplate = $("#chatBoxTemplate").clone();
                                if(userObj.user_id == response[x].sender_id){
                                    chatBoxTemplate.attr("style","border-radius: 8px 3px 3px 8px;padding: 5px;color: black;background-color: #dcf8c6;width:max-content;margin:10px;margin-left:auto;");
                                    //chatBoxTemplate.attr("class","pull-right")
                                    }else{
                                        chatBoxTemplate.attr("style","border-radius: 8px 3px 3px 8px;padding: 5px;color: black;background-color: #eef8f1;width:max-content;margin:10px;");    
                                      //  chatBoxTemplate.attr("class","pull-left");
                                    }
                                chatBoxTemplate.find("#chatMessage")[0].innerHTML = response[x].message;
                                chatBoxTemplate.appendTo("#chatDetails");
                            }
                            var chatDivHeight = document.getElementById("chatDetails").scrollHeight;
                            $('#chatDetails').animate({scrollTop:chatDivHeight}, 'slow');
                        console.log("data after success login"+response);
                        },
                        error: function(data, status, er) {
                            alert("data Failed!");
                        }
                    });
                }
            }
            });


    }

    //Author Farrukh: For Agent Id

     $.ajax({
            url: apiEndPoint+"user/agents",
            type: "GET", // By default GET,
            success: function(data) {
                console.log("data after success login"+data);
                $.each(data, function(obj) {
                    $('#statusSel').append($('<option>', {value:data[obj].user_id, text:data[obj].name}));
                });
            },
            error: function(data, status, er) {
                alert("data Failed!");
            }
        });

    //Customer Requesting Listing: Author Farukh
    function customerRequestListing(){
        console.log("inside requestListing function");
        $("#customerRfl").attr("style","display:block;");
        $("#customerInbox").attr("style","display:none;");
        $("#customerProfile").attr("style","display:none;");

        $('#sendRequest').click(function(event)
        {
            event.preventDefault();
            sendingRequest();
        });

        function sendingRequest()
        {
            var cusTitle = $('#custTitle').val();
            var cusCity = $('#custCity').val();
            var cusAddress = $('#custAddress').val();
            var cusLocation = $('#custLoc').val();
            var cusPrice = $('#custPrice').val();
            var cusArea = $('#custArea').val();
            var cusBid = $('#custBid').val();
            var cusMsg = $('#cust_message').val();
            var agentId = $('#statusSel').val();

            $.ajax({
            url: apiEndPoint+"agent/listing",
            type: "POST",
            data: {
                title: cusTitle,
                city: cusCity,
                address: cusAddress,
                location: cusLocation,
                price: cusPrice,
                area: cusArea,
                isBiddable: cusBid,
                description: cusMsg,
                status: 2,
                agentId: agentId,
                customerId: userObj.user_id
            },
            success: function(data) {
                $("#customerRflFrom")[0].reset();
                $("#toaster-success").show();
                document.getElementById("succesToasterData").innerHTML = "Succefully Sent Listing Details";
                setTimeout(function(){
                  hideToaster();
                }, 4000);
            },
            error: function(data, status, er) {
                $("#toaster-fail").show();
                document.getElementById("failToasterData").innerHTML = "Oops! Something went wrong!";
                setTimeout(function(){
                  hideToaster();
                }, 4000);
            }
        });


        }

    }
    //Customer Profile
    function customerProfile(){
       $("#upName").val(userObj.name);
       $("#upEmail").val(userObj.email);
       $("#upAddress").val(userObj.address);
       $("#upContact").val(userObj.contact);
       document.getElementById("customerProfileImg").innerHTML = "<img  src="+apiEndPoint+"user/image?userId="+userObj.user_id+" style='width:150px;height:150px;'>"; 

       $("#upCusBtn").click(function(argument) {
        var dataObj = {
                name:$("#upName").val(),
                email:$("upEmail").val(),
                address:$("#upAddress").val(),
                contact:$("#upContact").val(),
                userId:userObj.user_id,
                email:$("#upEmail").val(),
                password:$("#upPassword").val()
            }
        console.log("User data before sending",dataObj);
        $.ajax({
            url: apiEndPoint+"user/update",
            type: "POST",
            data: dataObj,
            success: function(data) {
            console.log("data after success login",data);
            if(data){
                $("#toaster-success").show();
                document.getElementById("succesToasterData").innerHTML = "Succefully Updated Profile Details";
                setTimeout(function(){
                  hideToaster();
                }, 4000);
                localStorage.setItem('userObj', JSON.stringify(data[0]));
            }
            },
            error: function(data, status, er) {
                $("#toaster-fail").show();
                document.getElementById("failToasterData").innerHTML = "Oops! Something went wrong!";
                setTimeout(function(){
                  hideToaster();
                }, 4000);
            }
        });
       });

    }


    function getAgentDashboardData() {
        agentInbox();
        agentManageListing();
        agentProfile();

    }



    //Agent Dashboard 
    function agentDashboard(){
        $( "#uiView" ).load( "../pages/agentDashboard.html", function() {
            getAgentDashboardData();
            $('#agentInbox').attr("style","display:block;visiblity:visible;");
            $("#agentMl").attr("style","display:none;");
            $("#agentPl").attr("style","display:none;");
            $("#agentProfile").attr("style","display:none;");
        
            $('#agentInboxBtn').click(function() {
                $('#agentInbox').attr("style","display:block;visiblity:visible;");
                $("#agentMl").attr("style","display:none;");
                $("#agentPl").attr("style","display:none;");
                $("#agentProfile").attr("style","display:none;");


                $('#navInbox').attr("class","active");
                $('#navMl').attr("class","inActive");
                $('#navPl').attr("class","inActive");
               document.getElementById("navProfile").classList.remove("active");
            });
            $('#agentMlBtn').click(function() {
                $('#agentMl').attr("style","display:block;visiblity:visible;");
                $("#agentInbox").attr("style","display:none;");
                $("#agentPl").attr("style","display:none;");
                $("#agentProfile").attr("style","display:none;");
                
                $('#navInbox').attr("class","inActive");
                $('#navMl').attr("class","active");
                $('#navPl').attr("class","inActive");
               document.getElementById("navProfile").classList.remove("active");
               agentManageListing();     
            });

            $('#agentPlBtn').click(function() {
                $('#agentPl').attr("style","display:block;visiblity:visible;");
                $("#agentMl").attr("style","display:none;");
                $("#agentInbox").attr("style","display:none;");
                $("#agentProfile").attr("style","display:none;");
                $("#postAgentListingBtn").click(function(){
                    agentPostListing();
                });
                $('#navInbox').attr("class","inActive");
                $('#navMl').attr("class","inActive");
                $('#navPl').attr("class","active");
               document.getElementById("navProfile").classList.remove("active");
            });

            $('#agentProfileBtn').click(function() {
                $('#agentProfile').attr("style","display:block;visiblity:visible;");
                $("#agentMl").attr("style","display:none;");
                $("#agentPl").attr("style","display:none;");
                $("#agentInbox").attr("style","display:none;");
                
                $('#navInbox').attr("class","inActive");
                $('#navMl').attr("class","inActive");
                $('#navPl').attr("class","inActive");
                document.getElementById("navProfile").classList.add("active");
            });
        });
    }

    //agent Inbox tab
    function agentInbox(){
        $("#agentChatDetails").attr("style","display:none;");
        console.log("in agent inbox function");
        //api call to get all the messages
        var url ="user/messages?userId="+userObj.user_id;
        $.ajax({url:apiEndPoint+url, success: function(response){
            console.log("response",response);
            var currentChatObj = "";
            if(response.length > 0){
                for(var i=0;i < response.length;i++) {
                    var template = $('#chatListItemTemplate').clone();

                    template.attr("class","list-group-item");
                    template.attr("data",i);
                    template.attr("id","chatItem"+i);
                    template.find(".chatItemText")[0].innerHTML = response[i][0].sender_name;
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
            }else{
                document.getElementById('appendChatList').innerHTML = "<h3> <i> No messages here!!</i></h3>";
            }
            
            $("#newChatSendBtn").click(function() {

               var newChatMsg = $("#newChatMessage").val();
               console.log("current Object",currentChatObj,newChatMsg);
               $.ajax({
                            url: apiEndPoint+"user/message",
                            type: "POST",
                            data: {
                                message: newChatMsg,
                                senderId: userObj.user_id,
                                listingId:currentChatObj[0].listing_id,
                                receiverId:currentChatObj[0].sender_id
                            },
                            success: function(response) {
                            console.log("message sent",response);
                            newChatMsg = "";
                            $("#newChatMessage").val("");
                            var respArr = response;
                            currentChatObj = response;
                            var chatBoxTemplate = $("#chatBoxTemplate").clone();
                            if(userObj.user_id == response[0].sender_id){
                                chatBoxTemplate.attr("style","border-radius: 8px 3px 3px 8px;padding: 5px;color: black;background-color: #dcf8c6;width:max-content;margin:10px;margin-left:auto;");
                                //chatBoxTemplate.attr("class","pull-right")
                                }else{
                                    chatBoxTemplate.attr("style","border-radius: 8px 3px 3px 8px;padding: 5px;color: black;background-color: #eef8f1;width:max-content;margin:10px;");    
                                  //  chatBoxTemplate.attr("class","pull-left");
                                }
                            chatBoxTemplate.find("#chatMessage")[0].innerHTML = response[0].message;
                            chatBoxTemplate.appendTo("#chatDetails");
                            var chatDivHeight = document.getElementById("chatDetails").scrollHeight;
                            $('#chatDetails').animate({scrollTop:chatDivHeight}, 'slow');
                            },
                            error: function(data, status, er) {
                                console.log("Error",data);
                            }
                        });

            })
            function getChatDetails(idx,response){
                    
                currentChatObj = "";
                $("#agentChatDetails").attr("style","display:block;");
                document.getElementById("chatDetails").innerHTML = " ";
                var chatListingLinks = document.getElementsByClassName("list-group-item");
                for(var i=0;i < chatListingLinks.length;i++) {
                    if(idx == i){
                        chatListingLinks[i].classList.add("active");  
                    }else{
                        chatListingLinks[i].classList.remove("active");
                    }
                    
                 }
                //$("#chatDetails").innerHTML = "";
                $.ajax({
                    url: apiEndPoint+"user/conversation?senderId="+response[idx][0].sender_id+"&receiverId="+userObj.user_id,
                    type: "GET", // By default GET,
                    success: function(response) {
                        for(var x=0;x<response.length;x++){
                            var respArr = response;
                            currentChatObj = response;
                            var chatBoxTemplate = $("#chatBoxTemplate").clone();
                            if(userObj.user_id == response[x].sender_id){
                                chatBoxTemplate.attr("style","border-radius: 8px 3px 3px 8px;padding: 5px;color: black;background-color: #dcf8c6;width:max-content;margin:10px;margin-left:auto;");
                                //chatBoxTemplate.attr("class","pull-right")
                                }else{
                                    chatBoxTemplate.attr("style","border-radius: 8px 3px 3px 8px;padding: 5px;color: black;background-color: #eef8f1;width:max-content;margin:10px;");    
                                  //  chatBoxTemplate.attr("class","pull-left");
                                }
                            chatBoxTemplate.find("#chatMessage")[0].innerHTML = response[x].message;
                            chatBoxTemplate.appendTo("#chatDetails");
                        }
                        console.log("chatdiv Height",document.getElementById("chatDetails").scrollHeight);
                        var chatDivHeight = document.getElementById("chatDetails").scrollHeight;
                            $('#chatDetails').animate({scrollTop:chatDivHeight}, 'slow');
                    },
                    error: function(data, status, er) {
                        alert("data Failed!");
                    }
                });
            }
        }
        });
    }

    
    //agent Manage Listing
    function agentManageListing(){
        //temp*--- calling search api for data, replace with actual api call 
        $("#appendListings").show();
        var searchUrl = "agent/listings?userId="+userObj.user_id; 
        document.getElementById("appendListings").innerHTML = " ";
        $.ajax({url:apiEndPoint+searchUrl, success: function(response){
            console.log("response in Agent Ml ",response);
            if(response.length == 0){
                $("#appendListingEdit").hide();
                $("#agentMLNoState").show();
            }else{
                $("#agentMLNoState").hide();
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
                    template.find("#listingActionBtn")[0].innerHTML = '<button type="button" class="pull-right agentActionEdit" data="'+response[i].listing_id+'"  style="margin:5px;"> Edit </button><button type="button" class="pull-right agentActionDelete" data="'+response[i].listing_id+'"  style="margin:5px;"> Delete </button>';
                    template.find("#listingBedValue")[0].innerHTML = "("+response[i].beds+")";
                    template.find("#listingBathValue")[0].innerHTML = "("+response[i].baths+")";
                    template.find("#listingCity")[0].innerHTML = response[i].city;
                    if(response[i].total_images > 0){
                        template.find("#searchListingImg")[0].innerHTML = "<img style='width:300px;height:248px;' src='"+apiEndPoint+"listing/image?listingId="+response[i].listing_id+"&number=1'>"; 
                    }else{
                      template.find("#searchListingImg")[0].innerHTML = "<img src=../images/demo/property-3.jpg>";  
                    }
                   // template.find("#listingDescription")[0].innerHTML = response[i].description;
                    template.appendTo("#appendListings"); 
                    $("#appendListingEdit").hide();   
                }
                var agentActionEditBtns = document.getElementsByClassName("agentActionEdit");
                console.log("agentActionEdit",agentActionEditBtns);
                for(var i=0;i < agentActionEditBtns.length;i++) {
                    agentActionEditBtns[i].addEventListener("click", function(){
                        var idx = this.getAttribute("data");
                        console.log("id of the listing",idx);
                        $("#appendListingEdit").show();
                        $("#appendListings").hide();
                        $.ajax({
                            url: apiEndPoint+"listing?listingId="+idx,
                            type: "GET", // By default GET,
                            success: function(response) {
                                console.log("response",response);
                                $("#agentEditTitle").val(response[0].title);
                                $("#agentEditCity").val(response[0].city);
                                $("#agentEditLocation").val(response[0].location);
                                $("#agentEditAddress").val(response[0].address);
                                $("#agentEditPrice").val(response[0].price);
                                $("#agentEditArea").val(response[0].area);
                                $("#agentEditBeds").val(response[0].beds);
                                $("#agentEditBaths").val(response[0].baths);
                                $("#agentEditStatus").val(response[0].status);
                                if(response[0].is_biddable == 0){
                                    $("#agentEditBiddable").val("on");
                                }
                                $("#agentEditDescription").val(response[0].description);
                                
                            },
                            error: function(data, status, er) {
                                alert("data Failed!");
                            }
                        });
                        $("#agentCancEditListingBtn").click(function(){
                            $("#appendListingEdit").hide();
                            //agentManageListing();
                            $("#appendListings").show();
                        });
                        $("#agentEditListingBtn").click(function() {
                            var biddableValue = 1;
                            if($("#agentEditBiddable").val() == "on"){
                                biddableValue = 0;
                            }
                            var dataObj ={
                                title :$("#agentEditTitle").val(),
                                city:$("#agentEditCity").val(),
                                location:$("#agentEditLocation").val(),
                                address:$("#agentEditAddress").val(),
                                price: $("#agentEditPrice").val(),
                                area:$("#agentEditArea").val(),
                                
                                beds:$("#agentEditBeds").val(),
                                baths:$("#agentEditBaths").val(),
                                status:$("#agentEditStatus").val(),
                                description:$("#agentEditDescription").val(),
                                isBiddable:biddableValue,
                                listingId:idx,
                                agentAddress:response[0].agent_address,
                                agentContact:response[0].agent_contact,
                                agentEmail:response[0].agent_email,
                                agentId:response[0].agent_id,
                                agentName:response[0].agent_name,
                                customerId:response[0].customer_id,
                                listedDate:response[0].listed_date
                            };

                            $.ajax({
                                url: apiEndPoint+"agent/listing/update",
                                type: "POST", // By default GET,
                                data:dataObj,
                                success: function(response) {
                                    console.log("response",response);
                                    $("#toaster-success").show();
                                    document.getElementById("succesToasterData").innerHTML = "Updated Successfully!";
                                    setTimeout(function(){
                                      hideToaster();
                                    }, 4000);
                                    agentManageListing();
                                },
                                error: function(data, status, er) {
                                    $("#toaster-fail").show();
                                    document.getElementById("failToasterData").innerHTML = "Oops! Something went wrong!";
                                    setTimeout(function(){
                                      hideToaster();
                                    }, 4000);
                                }
                            });
                        }); 
                    });
                }
                var agentActionDeleteBtns = document.getElementsByClassName("agentActionDelete");

                for(var i=0;i < agentActionDeleteBtns.length;i++) {
                    agentActionDeleteBtns[i].addEventListener("click", function() {
                        var idx = this.getAttribute("data");
                        console.log("id of the listing",idx);

                        var dataObj = {
                            listingId:idx
                        };
                        $.ajax({
                            url: apiEndPoint+"agent/listing",
                            data:dataObj,
                            method:"DELETE",
                            success: function(response) {
                                console.log("response after deleteting",response);
                                $("#toaster-success").show();
                                document.getElementById("succesToasterData").innerHTML = "Deleted Successfully!";
                                setTimeout(function(){
                                  hideToaster();
                                }, 4000);
                                agentManageListing();
                            },
                            error: function(data, status, er) {
                                $("#toaster-fail").show();
                                document.getElementById("failToasterData").innerHTML = "Oops! Something went wrong!";
                                setTimeout(function(){
                                  hideToaster();
                                }, 4000);
                            }
                            });
                        
                    });
                }
            }
        }
    });
            var appnd = document.getElementById('appendHere');        
    }
    //agent Profile
    function agentProfile(){
        $("#upName").val(userObj.name);
        $("#upEmail").val(userObj.email);
        $("#upAddress").val(userObj.address);
        $("#upContact").val(userObj.contact);
        //$("#upPassword").val(userObj.passowrd);
        document.getElementById("agentProfileImg").innerHTML = "<img  src="+apiEndPoint+"user/image?userId="+userObj.user_id+" style='width:150px;height:150px;'>"; 

        $("#upAgenBtn").click(function(argument) {
            var dataObj = {
                name:$("#upName").val(),
                email:$("upEmail").val(),
                address:$("#upAddress").val(),
                contact:$("#upContact").val(),
                userId:userObj.user_id,
                email:$("#upEmail").val(),
                password:$("#upPassword").val()
            }
            console.log("User data before sending",dataObj);
            $.ajax({
                url: apiEndPoint+"user/update",
                type: "POST",
                data: dataObj,
                success: function(data) {
                console.log("data after success login",data);
                if(data){
                   $("#toaster-success").show();
                    document.getElementById("succesToasterData").innerHTML = "Updated Successfully!";
                    setTimeout(function(){
                      hideToaster();
                    }, 4000);
                    localStorage.setItem('userObj', JSON.stringify(data[0]));
                }
                },
                error: function(data, status, er) {
                    $("#toaster-fail").show();
                    document.getElementById("failToasterData").innerHTML = "Oops! Something went wrong!";
                    setTimeout(function(){
                      hideToaster();
                    }, 4000);
                }
            });


        });
    }

    // agent Post Listing
    var apiInProcess = false;
    function agentPostListing(){
        $(".postAgentListingForm").unbind();
        $(".postAgentListingForm").submit( function(event) {
            event.preventDefault();
            var formData = new FormData(this);
            console.log("formData",formData);
            // Adds Agent and Customer Id
            formData.append("agentId", userObj.user_id);
            formData.append("customerId", null);
            console.log("formData",formData);
            if(!apiInProcess && $("#postTitle").val()!== '' && $("#postDescription").val() !== '' && $("#postPrice").val()!== '' && $("#postStatus").val()!== '' && $("#postAddress").val()!== '' && $("#postCity").val()!== '' && $("#postLocation").val()!== '' && $("#postBaths").val()!== '' && $("#postBeds").val()!== '' && $("#postArea").val()!== ''){
                apiInProcess = true;
                $.ajax({
                url: apiEndPoint+"agent/listing",
                type: "post",
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    console.log("data after success login",data);
                    apiInProcess = false;
                    $("#postTitle").val("");
                    $("#postDescription").val("");
                    $("#postPrice").val("");
                    $("#postStatus").val("1");
                    $("#postAddress").val("");

                    $("#postCity").val("");
                    $("#postLocation").val("");
                    $("#postBaths").val("");
                    $("#postBeds").val("");
                    $("#postArea").val("");
                    $("#toaster-success").show();
                    document.getElementById("succesToasterData").innerHTML = "Updated Successfully!";
                    setTimeout(function(){
                        hideToaster();
                    }, 4000);
                },
                error: function() {
                    $("#toaster-fail").show();
                    apiInProcess=false;
                    document.getElementById("failToasterData").innerHTML = "Oops! Something went wrong!";
                    setTimeout(function(){
                        hideToaster();
                    }, 4000);
                }
            });
            }else{
                console.log("empty");
            }
            
        }).submit();
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

