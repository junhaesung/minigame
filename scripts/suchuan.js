dx = [0, -1, 0, 1];
dy = [-1, 0, 1, 0];
const n = 0;
const ROW = 7;
const COL = 5;
let path_list = [];
const w = 50;
const h = 70;
const m = [];
let state = 0;  // 0 : first, 1 : second 
let start = [];
m.push([0, 0, 0, 0, 0]);
m.push([0, 3, 1, 2, 0]);
m.push([0, 2, 2, 2, 0]);
m.push([0, 3, 0, 3, 0]);
m.push([0, 1, 2, 1, 0]);
m.push([0, 3, 2, 1, 0]);
m.push([0, 0, 0, 0, 0]);

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

    if (x > ROW || y > COL) {
      return; 
    }
    if (m[x][y] == 0) {
      return;
    }

    // 하이라이트
    ctx.beginPath();
    ctx.moveTo(x*w, y*h);
    ctx.lineTo(w*(x+1), h*y);
    ctx.lineTo(w*(x+1), h*(y+1));
    ctx.lineTo(w*x, h*(y+1));
    ctx.lineTo(w*x, h*y);
    ctx.stroke();

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
        drawAllCards();
      }, 100);

      start = [];
      state = 0;
    }
    console.log(state);
  });
  
  // 
  function init () {
    for (let i=0; i<ROW; i++) {
      for (let j=0; j<COL; j++) {
        if (m[i][j] == 0) {
          continue;
        }
        const imageName = 'card_0' + m[i][j].toString();
        drawCard(imageName, w*i, h*j, w, h);
      }
    }
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

  // 모든 카드 다시 그리기
  function drawAllCards () {
    console.log('drawAllCards');
    for (let i=0; i<ROW; i++) {
      for (let j=0; j<COL; j++) {
        if (m[i][j] == 0) continue;
        const imageName = `card_0${m[i][j]}`;
        console.log(imageName);
        drawCard(imageName, i*w, j*h, w, h);
      }
    }
  }
  
  // 주어진 경로 배열을 그리기
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
  
  // 특정 카드의 짝이 있는지 검사
  function findPair (r, c) {
    path_list = [];
    const tmp = [];
    tmp.push(r)
    tmp.push(c);
    const path = [];
    path.push(tmp);

    for (let k=0; k<4; k++) {
      const x = r + dx[k];
      const y = c + dy[k];
      go(x, y, k, 0, tmp, m[r][c]);
    }
    let shortest_path = [];
    for (let p of path_list) {
      if (shortest_path.length == 0 || shortest_path.length > p.length) {
        shortest_path = p;
      }
    }
    return shortest_path;
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
    path_list.push(pathCloned);

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
  init();
});