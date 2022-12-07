import axios from "axios"

export async function getVersion() {
    const response = await axios.get('https://s3.amazonaws.com/setup.roblox.com/version', {
        method: 'GET',
        url: '',
        maxRedirects: 0,
        //Prevent redirects, useless but has no reason to be removed
        data: {},
        headers: {}
    })
    return response.data
}