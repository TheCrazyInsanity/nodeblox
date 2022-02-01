
let authticket = null
let version = null
const delay = require('delay');
const { exec } = require("child_process");
const noblox = require('noblox.js')
async function openclient (cookiehere, gameid, jobid) {
const cookie = cookiehere
  var XCSRF = "If you see this something fucked up"
  async function xscrffuckin() {
    const currentUser = await noblox.setCookie(cookie) 
    //Use noblox to set the cookie it is going to use
    console.log(`Preparing to join using ${currentUser.UserName} [${currentUser.UserID}]`)
    XCSRF = await noblox.getGeneralToken()
    //Get the xcsrf token using noblox, would have helped to know this earlier :/
    console.log(`FUCK YEAH GOT THE FUCKING XC WHATEVER TOKEN POGG ${XCSRF}`);
  }
  await xscrffuckin()

const axios = require('axios')
async function authticketfuckin(){
let dumb = 1 
//Axios post request to get an auth ticket
dumb = axios({
  method: 'POST', //you can set what request you want to be
  url: 'https://auth.roblox.com/v1/authentication-ticket',
  maxRedirects: 0,
  //Prevent redirects, useless but has no reason to be removed
  data: {},
  headers:{
      'x-csrf-token':XCSRF,
      'referer':'https://www.roblox.com/', //Fuck you
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
  method: 'GET', //you can set what request you want to be
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

//Get browser id (fuck you extra extra) 
//Example link https://assetgame.roblox.com/game/PlaceLauncher.ashx?request=RequestGame&browserTrackerId=110592347077&placeId=843468296&isPlayTogetherGame=false
var browseridlinksex = "Oops"
async function urlfuckin(){
browseridlinksex = `https://assetgame.roblox.com/game/PlaceLauncher.ashx?request=RequestGameJob^&browserTrackerId=${time}^&placeId=${gameid}^&gameId=${jobid}^&isPlayTogetherGame=false`
console.log(browseridlinksex)
}
await urlfuckin()
await delay(1000)
async function openfuckin(){
await delay(1000)
var launchoptions = `%localappdata%/Roblox/Versions/${version}/RobloxPlayerBeta.exe --play -t ${authticket} -j ${browseridlinksex} -b ${time} --launchtime=${time} --rloc en_us --gloc en_us`
console.log(launchoptions)
exec(launchoptions)

}
openfuckin()
//func end, dont place below here
}
openclient()
