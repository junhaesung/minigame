$(document).ready(function () {
    init();//로그인했다고 생각
    /*$("body").click(function (e) {
        alert(e.pageX+","+e.pageY);
    });*/
});

function init() {
  var storage = localStorage;
  storage.setItem('login','yes');
  storage.setItem('attendance','no');
  var count=storage.getItem('count');
  if(count)
    storage.setItem('count',count);
  else {
    storage.setItem('count','0');
  }
}

function attendanceCheck() {

  var storage=localStorage;
  var login = storage.getItem('login');
  var attendance = storage.getItem('attendance');
  var count= storage.getItem('count');

  if(login ==='yes')//login 했을 때
  {
    if(attendance === 'no'){
        storage.removeItem('attendance');
        storage.setItem('attendance','yes'); //출석했다고 바꿔주기
        count++;
        storage.removeItem('count');
        storage.setItem('count',count);
        alert('출석체크 완료');
        //canvas 캐릭터 이동하기
        var ctx= document.getElementById('attendanceCanvas').getContext('2d');
        var character=new Image();
        character.src="images/character.png";
        character.onload = function() {
          switch(count){
            case 1:
                ctx.drawImage(character, 264, 285, 70, 100);
              break;
              case 2:
                ctx.drawImage(character, 142, 244, 65, 90);
              break;
            case 3:
                ctx.drawImage(character, 64, 193, 50, 75);
              break;
            case 4:
                ctx.drawImage(character, 122, 153, 50, 75);
              break;
            case 5:
              ctx.drawImage(character, 170,115,40,60);
              break;
            case 6:
                ctx.drawImage(character, 227, 82, 40, 60);
              break;
            case 7:
              ctx.drawImage(character, 279, 60, 30, 45);
              break;
            case 8:
                ctx.drawImage(character, 235, 28, 30, 45);
              break;
            case 9:
                ctx.drawImage(character, 195, 11, 20, 35);
              storage.removeItem('count');
              storage.setItem('count','0');
              break;
          }
        };
        //하루마다 출첵 초기화(현재 24시간-제대로 계산 했다면...-로 해둠... 12시마다 초기화해야되지 않을까..?)
        setTimeout(()=>{
          storage.removeItem('attendance');
          storage.setItem('attendance','no');
        },14400000);

    }else{//이미 출석체크 했을 때
      alert('이미 출석 하셨습니다.');
    }
  }
  else {//login 안했을 때
    alert('로그인 하세요.');
  }
}
