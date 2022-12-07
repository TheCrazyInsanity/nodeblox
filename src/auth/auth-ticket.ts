import axios from "axios"


export async function getAuthTicket(XCSRF: string, cookie: string) {
    //Axios post request to get an auth ticket
    try {
        const data = await axios.post('https://auth.roblox.com/v1/authentication-ticket', {}, {
            //Prevent redirects, useless but has no reason to be removed
            maxRedirects: 0,
            headers: {
                'x-csrf-token': XCSRF,
                'referer': 'https://www.roblox.com/', //>:(
                Cookie: `.ROBLOSECURITY=${cookie}`
            }
        })

        return data.headers['rbx-authentication-ticket']
    }
    catch(err) {
        console.error(err)
        return null
    }

}
