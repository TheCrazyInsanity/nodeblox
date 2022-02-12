const { fstat } = require('fs');

//Why have many file, when can have one big file?
async function openclient (cookiehere, gameid, jobid) {
let authticket = null
let version = null
const delay = require('delay');
const { exec } = require("child_process");
const noblox = require('noblox.js')
const cookie = cookiehere
  var XCSRF = "If you see this something fucked up"
  async function xscrffuckin() {
    const currentUser = await noblox.setCookie(cookie) 
    //Use noblox to set the cookie it is going to use
    console.log(`Preparing to join using ${currentUser.UserName} [${currentUser.UserID}]`)
    XCSRF = await noblox.getGeneralToken()
    //Get the xcsrf token using noblox, would have helped to know this earlier :/
    console.log(`Got XCSRF token: ${XCSRF}`);
  }
  await xscrffuckin()

const axios = require('axios')
async function authticketfuckin(){
let dumb = 1 
//Axios post request to get an auth ticket
dumb = axios({
  method: 'POST',
  url: 'https://auth.roblox.com/v1/authentication-ticket',
  maxRedirects: 0,
  //Prevent redirects, useless but has no reason to be removed
  data: {},
  headers:{
      'x-csrf-token':XCSRF,
      'referer':'https://www.roblox.com/', //>:(
      Cookie: `.ROBLOSECURITY=${cookie}`
  }
})
.then(response => {console.log(`YOOO AUTH TICKET LETS GO ${response.headers['rbx-authentication-ticket']}`) //Also fuck you but less
authticket = response.headers['rbx-authentication-ticket']}) 
.catch(err => { console.log(err.response.data) })
}
await authticketfuckin()
//Axios get request to get the version number of roblox, so you dont have to update the script everytime you update roblox
async function versionfuckin(){
axios({
  method: 'GET',
  url: 'https://s3.amazonaws.com/setup.roblox.com/version',
  maxRedirects: 0,
  //Prevent redirects, useless but has no reason to be removed
  data: {},
  headers:{}
})
.then(response => {
  console.log(`Current roblox version: ${response.data}`)
  version = response.data
}) 
.catch(err => { console.log(err.response.data) })
}
await versionfuckin()
//Set variable time to current time in utc
let time = new Date().getTime()

//Get browser id ( >:( )
var browseridlinksex = "Oops"
async function urlfuckin(){
browseridlinksex = `https://assetgame.roblox.com/game/PlaceLauncher.ashx?request=RequestGameJob^&browserTrackerId=${time}^&placeId=${gameid}^&gameId=${jobid}^&isPlayTogetherGame=false`
console.log(browseridlinksex)
}
await urlfuckin()
await delay(1000)
async function openfuckin(){
await delay(1000)
var launchoptions = `"C:\Program Files (x86)\Roblox\Versions${version}/RobloxPlayerBeta.exe" --play -t ${authticket} -j ${browseridlinksex} -b ${time} --launchtime=${time} --rloc en_us --gloc en_us`
console.log(launchoptions)
children.push(exec(launchoptions).pid)

}
openfuckin()
//func end, dont place below here
}
//openclient(cookie, gameid, jobid)
exports.openclient = openclient

function execute(filelocation, scriplets){
  //Function taken from burkino, many thanks!
  function chunk(s, maxBytes) {
    let buf = Buffer.from(s);
    const result = [];
    while (buf.length) {
      result.push(buf.slice(0, maxBytes).toString());
      buf = buf.slice(maxBytes);
    }
    return result;
  }

  const fs = require('fs');
  //Stolen example code from ws, idk how to use it
  const WebSocketServer = require('ws').Server;

  const wss = new WebSocketServer({ port: 123 });
  
  wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      console.log('received: %s', data);
      //Should be a switch statement, but doing the smart thing broke it
      if (data == "ready"){
          console.log("client is ready, send the script")
          ws.send("start")
          //Script procesing and stuff here idk
          var rawscript = fs.readFileSync(filelocation)
          var scripletarr = scriplets.split(",")
          var index = 1
          scripletarr.forEach((scripletarr)=>{
          rawscript = `scripletarg`+ index +`=`+ scripletarr +`
          `+ rawscript
          index = index + 1
          })
          console.log(rawscript)
          var script = chunk(rawscript, 60000)
          script.forEach((script) => {
            ws.send(script);
          });
          ws.send("end")
        }
        if(data == "ok kys"){
          console.log("client is done, close the connection")
          //Close the connection
          ws.close()
        }
        if(data != "ready" && data != "ok kys"){
          console.log("unrecognized message, saved as a return (when i add it lol)")
      }
    });
  });
}
//execute(location to script, scriplets)
//execute("./scripletexample.lua", `"1","2","3"`) Check example scripletexample.lua, this would print 1 2 3 seperately in console
exports.execute = execute

function killall() {
  console.log("If This ever says killing 2, something is broken very bad")
  console.log('killing', children.length, 'child processes');
  children.forEach(function(child) {
      spawn("taskkill", ["/pid", children, '/f', '/t']);
      //Remove the child process from the array
      children.splice(children.indexOf(child), 1);
  });
};
//killall() No arguments as of yet
