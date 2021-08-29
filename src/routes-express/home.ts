import { Request, Response } from 'express';

function home(req: Request, res: Response) {
  const API_ROUTE = process.env.API_ROUTE;
  const lobbyID = '61254e8ff8731a6536a35773';

  const home = `
    <div>
      <h1>home</h1>
      <p>user: ${req.user}</p>
    </div>
  `;

  const register = `
    <div>
      <h1>register</h1>
      <form action='${API_ROUTE}/register' method='POST'>
        <div>
          <label for='username'>name</label>
          <input type='text' id='username' name='username' required>
        </div>
        <div>
          <label for='password'>password</label>
          <input type='password' id='password' name='password' required>
        </div>
        <button type='submit'>register</button>
      </form>
    </div>
  `;

  const login = `
    <div>
      <h1>login</h1>
      <form action='${API_ROUTE}/login' method='POST'>
        <div>
          <label for='username'>name</label>
          <input type='text' id='username' name='username' required>
        </div>
        <div>
          <label for='password'>password</label>
          <input type='password' id='password' name='password' required>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  `;

  const logout = `
    <div>
      <h1>logout</h1>
      <form action='${API_ROUTE}/logout' method='POST'>
        <button type='submit'>logout</button>
      </form>
    </div>
  `;

  const playSolo = `
    <div>
      <h1>play solo</h1>
      <form action='${API_ROUTE}/play/solo' method='POST'>
        <div>
          <label for='difficulty'>difficulty</label>
          <input type='text' id='difficulty' name='difficulty' value='easy'>
        </div>
        <div>
          <label for='height'>height</label>
          <input type='text' id='height' name='height'>
        </div>
        <div>
          <label for='width'>width</label>
          <input type='text' id='width' name='width'>
        </div>
        <div>
          <label for='bombCount'>bombCount</label>
          <input type='text' id='bombCount' name='bombCount'>
        </div>
        <div>
          <label for='maxLives'>maxLives</label>
          <input type='text' id='maxLives' name='maxLives'>
        </div>
        <button type='submit'>gen</button>
      </form>
    </div>
  `;

  const play = `
    <div>
      <h1>start play</h1>
      <form id="startform">
        <button>Send</button>
      </form>
    </div>
    <div>
      <h1>move</h1>
      <form id="moveform">
        <label for='act'>act</label>
        <input id="act" />
        <br />
        <label for='movex'>movex</label>
        <input id="movex" />
        <br />
        <label for='movey'>movey</label>
        <input id="movey" />
        <br />
        <button>Send</button>
      </form>
    </div>
    <div>
      <input id="status" />
    </div>

    <script src="https://cdn.socket.io/4.1.2/socket.io.min.js"></script>
    <script>
      let socket = io('http://localhost:${process.env.PORT}', {
        path: '${process.env.API_ROUTE}/socket',
        query: {'lobbyID': '${lobbyID}', 'action': 'play'}
      });

      let status = document.getElementById('status');
      let startform = document.getElementById('startform');
      startform.addEventListener('submit', function(e) {
        e.preventDefault();
        socket.emit('start');
      });
      
      let movex = document.getElementById('movex');
      let movey = document.getElementById('movey');
      let act = document.getElementById('act');
      let moveform = document.getElementById('moveform');
      moveform.addEventListener('submit', function(e) {
        e.preventDefault();
        socket.emit('move', {'action': act.value, 'row': movex.value, 'col': movey.value});
      });

      function showBoard(array) {
        // print header
        if (array.length > 0) console.log("  " + [...Array(array[0].length).keys()]);
        // print rows
        array.forEach((r, i) => {
          const row = r.join().replaceAll('0', ' ').replaceAll('?', '█');
          console.log(i + " " + row);
        });
      }

      socket.on('status', (s) => {status.value = s});
      socket.on('update', (d) => {console.log('update'); console.log(d); showBoard(d.board)});
      socket.on('results', (r) => {console.log('results'); console.log(r)});
    </script>
  `;
  return res.status(200).send(`
    ${play}
    ${playSolo}
    ${home}
    ${register}
    ${login}
    ${logout}
  `);
}

export default home;
