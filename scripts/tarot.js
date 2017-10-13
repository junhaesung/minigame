var card = 0;
function selectCard(one){
	card = one;
	$(".tarot_card img").css("background-color", "trasparent");
	$(".tarot_card img:nth-child("+one+")").css("background-color", "rgba(0, 255, 2, 0.53)");
}

function goUnsae(){
	
	var name = $("#name").val();
	$("#nameView").text(name);
	if(name == null || name == ""){
		alert("이름을 입력해주세요!");
	}else if(card == 0){
		alert("카드를 선택해주세요!");
	} else {
		$(".main").css("display", "none");
	
		//JSON 파일 	
		var callJSON = Math.floor((Math.random() * (4 - 1 + 1)) + 1);
		var JSONFile = "";
		var endNumber;
		var title="";
		var info="";
		var a_href="";
		var img_src = "";
		
		//p 문구 결정
		var pMungu = Math.floor((Math.random() * (6 - 1 + 1)) + 1);
		
		//class 결정
		var classD = "";
		
		switch(callJSON){	
		case 1 : JSONFile = "./json/Lohas_health.json";
		endNumber = 36;
		classD =".reult_lohasHealth ";
		case 2 : JSONFile = "./json/Lohas_living.json";
		endNumber = 0;
		classD =".reult_lohasLiving ";
		case 3 : JSONFile = "./json/Lohas_kit.json";
		endNumber = 14;
		classD =".reult_lohasKit ";
		case 4 : JSONFile = "./json/Lohas_skinCare.json";
		endNumber = 32;
		classD =".reult_lohasSkinCare ";
		}
		
		$.getJSON(JSONFile,function(data){
			var n = Math.floor((Math.random() * (endNumber - 0 + 1)) + 1);
			$('.proTitle').text(data[n].titleAll);
			$("#proImg").attr('src',data[n].src_hrefAll);
			$("#proLink").attr('href',data[n].a_hrefAll);
		});
		
		$(".main1").css("display", "block");
		$(classD + "p:nth-child(" + pMungu + ")").css("display", "block");		
	}
}