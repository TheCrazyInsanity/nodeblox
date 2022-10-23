import { exec } from 'child_process';
import { getAuthTicket } from './src/auth/auth-ticket';
import { getXCSRFToken } from './src/auth/XCSRF';
import { getVersion } from './src/other/version';
import { config } from 'dotenv';

const children: number[] = [];
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
config();
const { ROBLOX_COOKIE, GameID, JobID, RobloxFileLocation } = process.env;
prepareClient();

async function prepareClient() {
	if(!ROBLOX_COOKIE) return console.error('Roblox Cookie is not defined.')
	if(!GameID) return console.error('GameID is not defined.')
	if(!JobID) return console.error('JobID is not defined.')
	openClient(ROBLOX_COOKIE, Number(GameID), JobID)
}

// Why have many file, when can have one big file?
// To make it from an unreadable mess to a readable mess. -ATXL


export async function openClient(cookie: string, gameid: number, jobid: string) {
	const XCSRF = await getXCSRFToken(cookie)
	const ticket = await getAuthTicket(XCSRF, cookie);
	const version = await getVersion();
	if(!XCSRF) return console.error(`Failed to get XCSRF token. Output is: ${XCSRF}`)
	if(!ticket) return console.error(`Failed to get auth ticket token. Output is: ${ticket}`)

	console.log(`Got XCSRF token: ${XCSRF}`);
	
	//Set variable time to current time in utc
	let time = new Date().getTime()
	//Get browser id ( >:( )
	var browseridlinksex = "Oops"
	async function urlfuckin() {
		browseridlinksex = `https://assetgame.roblox.com/game/PlaceLauncher.ashx?request=RequestGameJob^&browserTrackerId=${time}^&placeId=${gameid}^&gameId=${jobid}^&isPlayTogetherGame=false`
		console.log(browseridlinksex)
	}
	await urlfuckin()
	await sleep(1000)
	async function openfuckin() {
		await sleep(1000)
		var launchoptions = `"${RobloxFileLocation ? `${RobloxFileLocation}/${version}/RobloxPlayerBeta.exe`: `C:/Program Files (x86)/Roblox/Versions/${version}/RobloxPlayerBeta.exe`}" --play -t ${ticket} -j ${browseridlinksex} -b ${time} --launchtime=${time} --rloc en_us --gloc en_us`
		const client = exec(launchoptions).pid 
		if(!client) return console.log('wtf happened?')
		console.log(launchoptions)
		children.push(client)
	}
	openfuckin()
	//func end, dont place below here
}

function execute(filelocation, scriplets) {
	//Function taken from burkino, many thanks!
	function chunk(s, maxBytes) {
		let buf = Buffer.from(s);
		const result: string[] = [];
		while (buf.length) {
			result.push(buf.slice(0, maxBytes).toString());
			buf = buf.slice(maxBytes);
		}
		return result;
	}
	const fs = require('fs');
	//Stolen example code from ws, idk how to use it
	const WebSocketServer = require('ws').Server;
	const wss = new WebSocketServer({
		port: 123
	});
	wss.on('connection', function connection(ws) {
		ws.on('message', function message(data) {
			console.log('received: %s', data);
			//Should be a switch statement, but doing the smart thing broke it
			if (data == "ready") {
				console.log("client is ready, send the script")
				ws.send("start")
				//Script procesing and stuff here idk
				var rawscript = fs.readFileSync(filelocation)
				var scripletarr = scriplets.split(",")
				var index = 1
				scripletarr.forEach((scripletarr) => {
					rawscript = `scripletarg` + index + `=` + scripletarr + `
` + rawscript
					index = index + 1
				})
				console.log(rawscript)
				var script = chunk(rawscript, 60000)
				console.log(script)
				script.forEach((script) => {
					ws.send(script);
				});
				ws.send("end")
			}
			if (data == "ok kys") {
				console.log("client is done, close the connection")
				//Close the connection
				ws.close()
			}
			if (data != "ready" && data != "ok kys") {
				console.log("unrecognized message, saved as a return (when i add it lol)")
			}
		});
	});
}
//execute(location to script, scriplets)
//execute("./scripletexample.lua", `"1","2","3"`) Check example scripletexample.lua, this would print 1 2 3 seperately in console
exports.execute = execute

export function killAll() {
	//console.log("If This ever says killing 2, something is broken very bad")
	console.log(children.length === 2 ? `Killing ${children.length} child processes. crap this means something broke.` : `Killing ${children.length} child processes.`);
	children.forEach((child) => {
		const spawn = require('child_process').spawn;
		spawn("taskkill", ["/pid", children, '/f', '/t']);
		//Remove the child process from the array
		children.splice(children.indexOf(child), 1);
		console.log(`Killed child process: ${child}`)
	});
};