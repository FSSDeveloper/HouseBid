$( document ).ready(function() {
   $("#homeSearchBtn").click(function(){
   		$('#debbalaDiv').hide();
   		var city = $('#searchCity').val();
   		var location = $('#searchLocation').val();
   		console.log('city and location',city,location);
   		$.ajax({
			url: "http://localhost:3000/search?city="+city+"&location="+location,
			success: function(result){
				console.log('result',result);
				var appnd = document.getElementById('appendHere');
				// var data = JSON.parse(result);
				// console.log("data",data);
				for (var i = 0; i < result.length; i++) {
						// var idText = "searchCard"+i;
						var template = $('#searchCardTemplate').clone();
						 //var template = document.getElementById('searchCardTemplate').content.cloneNode(true);
						console.log("template",template);
						// template.attr('id',idText);
						template.attr('class',"searchIdx");
						template.attr('style',"display:block;");
						// var cardTitle = template.find(".card-title");
						// cardTitle[0].innerHTML = data[i].title;
						// console.log("card-title",cardTitle);
						template.find(".card-title")[0].innerHTML = result[i].title;
						template.find(".card-text")[0].innerHTML = result[i].price;
						// template[0].childNodes[1].innerHTML = data[i].title;
						// template.appendChild(appnd);
						template.appendTo("#appendHere");
					}
				}
			});
		$('#uiDiv').load('./templates/test.html');
   });

});