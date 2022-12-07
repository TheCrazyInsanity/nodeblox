import { getAuthTicket } from './src/auth/auth-ticket';
import { getXCSRFToken } from './src/auth/XCSRF';
import { getVersion } from './src/other/version';
import { chunk } from './src/utils/chunks';
import { exec } from 'child_process';
import { config } from 'dotenv';
import { Server } from 'ws';
import fs from 'fs';

config();
const { ROBLOX_COOKIE, GameID, JobID, RobloxFileLocation } = process.env;
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
const children: number[] = [];
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
	
	const time = new Date().getTime()
	//Get browser id ( >:( )
	let browserID = `https://assetgame.roblox.com/game/PlaceLauncher.ashx?request=RequestGameJob^&browserTrackerId=${time}^&placeId=${gameid}^&gameId=${jobid}^&isPlayTogetherGame=false`;

	await sleep(2000)
	const launchoptions = `"${RobloxFileLocation ? `${RobloxFileLocation}/${version}/RobloxPlayerBeta.exe`: `C:/Program Files (x86)/Roblox/Versions/${version}/RobloxPlayerBeta.exe`}" --play -t ${ticket} -j ${browserID} -b ${time} --launchtime=${time} --rloc en_us --gloc en_us`
	const client = exec(launchoptions).pid 
	if(!client) return console.log('wtf happened?');
	console.log(launchoptions)
	children.push(client)
}

//execute(location to script, scriplets)
//execute("./scripletexample.lua", `"1","2","3"`) Check example scripletexample.lua, this would print 1 2 3 seperately in console
export function execute(fileLocation: string, scriplets: string) {
	const wss = new Server({
		port: 123
	});

	wss.once('connection', (ws) => {
		ws.on('message', (data, isBinary) => {
			const message = isBinary ? data : data.toString();
			console.log(`Recieved: ${message}`);

			//Should be a switch statement, but doing the smart thing broke it
			if (message == "ready") {
				console.log("client is ready, send the script")
				ws.send("start")
				//Script procesing and stuff here idk
				let script = fs.readFileSync(fileLocation, { encoding: "utf-8" });
				const args = scriplets.split(",")
				
				args.forEach((arg) => {
					script = `scripletarg${args.indexOf(arg) + 1}= ${script}`;
				})

				const chunkedScript = chunk(script, 60000)
				
				chunkedScript.forEach((script) => {
					ws.send(script);
				});
				ws.send("end")
			} else if (message == "ok kys") {
				console.log("client is done, close the connection")
				//Close the connection
				ws.close()
			} else if (message != "ready" && message != "ok kys") {
				console.log("unrecognized message, saved as a return (when i add it lol)")
			}
		});
	});
}

export function killAll() {
	console.log(children.length === 2 ? `Killing ${children.length} child processes this is not supposed to happen.` : `Killing ${children.length} child processes.`);

	children.forEach((child) => {
		const spawn = require('child_process').spawn;
		spawn("taskkill", ["/pid", children, '/f', '/t']);
		
		//Remove the child process from the array
		children.splice(children.indexOf(child), 1);
		console.log(`Killed child process: ${child}`)
	});
};