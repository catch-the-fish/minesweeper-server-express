<h1 align="center">Online Minesweeper</h1>
<p width="100%" align="center">
	<a href="https://minesweeper.live">
		<img src="/client/public/logo192.png" width="30%" align="center">
	</a>
</p>

## <img src="/client/public/logo192.png" width="20px"> Introduction <a name="introduction"></a>
<!--- [![CodeFactor](https://www.codefactor.io/repository/github/penguinuwu/minesweeper/badge/master)](https://www.codefactor.io/repository/github/penguinuwu/minesweeper/overview/master) --->
hello! this is an implementation of minesweeper for the browser. feel free to try the game [here](https://minesweeper.live)!

## <img src="/client/public/logo192.png" width="20px"> Tools Used <a name="tools_used"></a>
- server side
	- express, express-session
	- socket.io
	- passport.js, bcrypt
	- mongodb, mongoose
- client side
	- react, react-router-dom
	- axios
	- socket.io-client
	- bootstrap
	- font awesome
- deployed on linode using nginx

## <img src="/client/public/logo192.png" width="20px"> Developing <a name="developing"></a>
- fork and clone the repository
- set up server in `minesweeper/server`
	- enter the server directory (e.g. `cd minesweeper/server`)
	- install dependencies using `npm install`
	- set up [MongoDB](https://docs.mongodb.com/manual/installation/) and get its connection URL
	- create `.env` file and set up according to the `.env.example` file
	- start server with `npm start`
- set up client in `minesweeper/client`
	- enter the client directory (e.g. `cd minesweeper/client`)
	- install dependencies using `npm install`
	- create `.env` file and set up according to the `.env.example` file
	- start client with `npm start`
- make edits wherever you wish!

## <img src="/client/public/logo192.png" width="20px"> Contributing <a name="contributing"></a>
all contributions are welcome! feel free to submit pull requests, bug reports, or other contributions!
