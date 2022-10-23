import * as noblox from "noblox.js";

export async function getXCSRFToken(cookie: string) {
    //Use noblox to set the cookie it is going to use
    const currentUser = await noblox.setCookie(cookie)
    console.log(`Preparing to join using ${currentUser.UserName} [${currentUser.UserID}]`)
    //Get the xcsrf token using noblox, would have helped to know this earlier :/
    return await noblox.getGeneralToken()
}