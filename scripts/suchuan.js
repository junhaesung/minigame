// 방향 나타내는 배열
const dx = [0, -1, 0, 1];
const dy = [-1, 0, 1, 0];
const n = 0;  // 이거어디서쓰지
const numberOfCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
let ROW = 7;
let COL = 5;
let path_list = []; // 게임판 탐색하며 성공한 경로 적어두는 배열
let w = 60;   // 카드 1장 너비
let h = 80;   // 카드 1장 높이
let m = []; // 지도 나타내는 배열
let state = 0;  // 0 : first, 1 : second 
let start = [];
let level = 0;  // 현재 게임의 레벨
let score = 0;  // 게임의 점수

$(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const canvasOffset = $("#canvas").offset();
  const offsetX = canvasOffset.left;
  const offsetY = canvasOffset.top;
  
  // 그리기 예제
  function draw() {
    const ctx = document.getElementById('canvas').getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = 'https://mdn.mozillademos.org/files/5395/backdrop.png';
  }
  
  /******************************************/
  
  // ctx.fillStyle = 'green';
  // ctx.fillRect(10, 10, 100, 100);
  // draw()
  /**
   * Canvas Click Event
   */
  canvas.addEventListener('click', (event) => {
    console.log('clicked');
    const x = Math.floor((event.clientX - offsetX) / w);
    const y = Math.floor((event.clientY - offsetY) / h);

    if (x >= ROW || y >= COL) {
      return; 
    }
    if (m[x][y] == 0) {
      return;
    }

    // 하이라이트
    drawEdge(x, y); 
    
    if (state == 0) {
      start.push(x);
      start.push(y);
      state = 1;
    } else {
      const result = findRoute(start[0], start[1], x, y);
      console.log(result);

      let isSuccess = false;
      if (start[0] == x && start[1] == y) {
        // 실패
        console.log('failure');
      } else if (m[start[0]][start[1]] != m[x][y]) {
        // 실패
        console.log('failure');
      } else if (result.length == 0) {
        // 실패
        console.log('failure');
        // start의 하이라이트 지우기
      } else {
        // 성공
        console.log('success');
        isSuccess = true;
      }

      // 성공했다면
      if (isSuccess) {
        // 경로 그리기
        drawPath(result);
        // 카드 지우기 (시작, 끝)
        const front = result[0];
        const back = result[result.length - 1];
        m[front[0]][front[1]] = 0;
        m[back[0]][back[1]] = 0;
      } 

      // 경로 지우기
      setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        start = [];
        state = 0;

        console.log(state);
        // 게임이 끝났는지 검사
        if (isGameEnd()) {
          // 게임이 끝났다고 처리하기
          // confirm('축하합니다!!');
          alert('clear!');
          if (level < 3) {
            return startGame();
          }
          return;
        }
        // 경로 검사
        countPairs();

        drawAllCards();
      }, 100);      
    }
  });

  // 게임 시작하기
  function startGame () {
    // 현재 레벨값을 참조하여 다음 레벨 게임을 시작한다. 
    level += 1;

    // 파일로부터 다음 레벨 정보 읽어오기, 변수 값 세팅
    $.get(`./data/level_0${level}.txt`, (data) => {
      m = []
      const lines = data.split('\n');
      let numberOfPairs = 0;
      _.forEach(lines, (line, k) => {
        if (k == 0) {
          const tmp = line.split(' ');
          ROW = parseInt(tmp[0]);
          COL = parseInt(tmp[1]);
          numberOfPairs = parseInt(tmp[2]);
          console.log(ROW, COL, numberOfPairs);
        } else {
          m.push(_.map(line.split(' '), (x) => parseInt(x)));
        }
      });

      // 카드가 들어갈 수 있는 자리의 쌍을 구함
      let points = [];
      for (let i=0; i<ROW; i++) {
        for (let j=0; j<COL; j++) {
          if (m[i][j] == 0) continue;
          const tmp = [];
          tmp.push(i);
          tmp.push(j);
          points.push(tmp);
        }
      }
      points = _.shuffle(points);

      // 현재 사용할 카드 종류를 선택함
      const selected = _.sampleSize(numberOfCards, numberOfPairs);
      _.forEach(selected, (k) => {
        // 맵에 쓰기
        let p = points.pop();
        m[p[0]][p[1]] = k;
        p = points.pop();
        m[p[0]][p[1]] = k;
      });

      console.log(m);
      init();
    });
  }
  
  // 초기화
  function init () {
    $('#canvas').attr('width', '360px');
    $('#canvas').attr('height', '640px');
    drawAllCards();
  }

  // 테두리 그리기
  function drawEdge (x, y) {
    ctx.beginPath();
    ctx.moveTo(x*w, y*h);
    ctx.lineTo(w*(x+1), h*y);
    ctx.lineTo(w*(x+1), h*(y+1));
    ctx.lineTo(w*x, h*(y+1));
    ctx.lineTo(w*x, h*y);
    ctx.stroke();
  }

  // 카드 그리기
  function drawCard(imageName, x, y, width, height) {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = `./images/${imageName}.jpg`;
    img.onload = () => {
      ctx.drawImage(img, x, y, width, height); 
    };
  }

  // 모든 카드 그리기
  function drawAllCards () {
    console.log('drawAllCards');
    for (let i=0; i<ROW; i++) {
      for (let j=0; j<COL; j++) {
        if (m[i][j] == 0) continue;
        let imageName = '';
        const c = m[i][j];
        if (c < 10) {
          imageName = 'card_0' + m[i][j].toString();
        } else {
          imageName += 'card_' + m[i][j].toString();
        }
        console.log(imageName);
        drawCard(imageName, i*w, j*h, w, h);
      }
    }
  }
  
  // 주어진 경로 배열을 선으로 잇기
  function drawPath (path) {
    console.log('drawPath');
    console.log(path.length);
    // draw path
    ctx.beginPath();
    _.forEach(path, (p, k) => {
      const x = w * p[0] + w/2;
      const y = h * p[1] + h/2;
      if (k == 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }

  // 게임이 끝났는지 검사
  // 끝났으면 true , 아니면 false
  function isGameEnd () {
    let count = 0;
    for (let row of m ) {
      for (let e of row) {
        count += e;
      }
    }
    return count == 0;
  }
  
  function countPairs () {
    let count = 0;
    for (let i=0; i<ROW; i++) {
      for (let j=0; j<COL; j++) {
        if (m[i][j] == 0) continue;
        if (findPair(i, j)) count += 1;
      }
    }
    if (count == 0) {
      console.log('짝이 맞는 카드가 없습니다 ㅠ_ㅠ');
    }
    return count;
  }

  // 특정 카드의 짝이 있는지 검사
  function findPair (r, c) {
    path_list = [];
    const tmp = [];
    tmp.push(r);
    tmp.push(c);
    const path = [];
    path.push(tmp);

    for (let k=0; k<4; k++) {
      const x = r + dx[k];
      const y = c + dy[k];
      go(x, y, k, 0, path, m[r][c]);
    }
    console.log(path_list);
    return path_list.length > 0;
  }

  function findRoute (r, c, a, b) {
    console.log(r, c, a, b, m[r][c], m[a][b]);
    path_list = [];
    const tmp = [];
    tmp.push(r)
    tmp.push(c);
    const path = [];
    path.push(tmp);

    for (let k=0; k<4; k++) {
      const x = r + dx[k];
      const y = c + dy[k];
      go(x, y, k, 0, path, m[r][c]);
    }

    let shortest_path = [];
    if (path_list.length == 0) {
      return [];
    }
    for (let p of path_list) {
      if (p[p.length-1][0] != a || p[p.length-1][1] != b) {
        continue;
      }
      if (shortest_path.length == 0 || shortest_path.length > p.length) {
        shortest_path = p;
      }
    }
    return shortest_path;
  }
  
  function go (i, j, k, turn, path, a) {
    // .slice();
    const pathCloned = _.clone(path);
    // 경계조건 검사
    if (i < 0 || j < 0 || i >= ROW || j >= COL) {
      return false;
    }
        
    // 턴 숫자 검사
    // 턴 3 이상이면 종료
    if (turn >= 3) {
      return false;
    }

    // 현재 경로 추가
    const tmp = []
    tmp.push(i);
    tmp.push(j);
    pathCloned.push(tmp)
    // path_list.push(pathCloned);

    // 현재 칸 검사
    // 정답이면 정답처리
    // 벽이나 다른카드이면 종료
    if (m[i][j] == a) {
      path_list.push(pathCloned);
      return true;
    } else if (m[i][j] != 0) {
      return false;
    }
        
    for (let d=0; d<4; d++) {
      // 뒤로 돌지 말기
      if (d == (k + 2) % 4) {
        continue;
      }
      x = i + dx[d];
      y = j + dy[d];
      if (d == k) {
        go(x, y, d, turn, pathCloned, a);
      } else {
        go(x, y, d, turn+1, pathCloned, a);
      }
    } 
  }

  // initialize
  // init();
  startGame();
});