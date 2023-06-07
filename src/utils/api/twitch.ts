
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET
const tokenURL = `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`

// twitch oauth token expires 80-90min after retrieval
var expireDate: Date = new Date(new Date().getTime() - 10000)
var oauthToken: string

type fetchToken = {
    access_token: string;
    expires_in: number;
    token_type: string;
}

type twitchData = {
    id: string
    login: string
    display_name: string
    type: string
    broadcaster_type: string
    description: string
    profile_image_url: string
    offline_image_url: string
    view_count: number
    created_at: string

} 

type fetchData = {
    data: [twitchData]
}

type twitchBadgeData = {
    badge_sets: {
        [badge_set: string]: object 
    }
}

async function fetchNewToken(): Promise<fetchToken | null> {

    console.log('Fetching new token...')
    
    // POST to get new token
    const res = await fetch(tokenURL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
    })

    // returns promise
    return new Promise((resolve, reject) => {
        // if POST ok returns 
        if(res.ok) {
            resolve(res.json())
            return
        }
        resolve(null)
    })

}

// Checks if token is expired and fetches new one if needed
async function checkToken() {

    // gets current date time
    let now = new Date()
   
    // if now is before expiration date
    if(oauthToken && now <= expireDate) {
        let remainingMs = Math.abs(expireDate.getTime() - now.getTime());
        console.log(`Twitch API oauth token still valid for ${new Date(remainingMs).toISOString().slice(11, 19)}m`)
        return
    }

    // fetches new oauth token from twitch
    let fetchTokenData = await fetchNewToken()

    if(!fetchTokenData) return null

    // updates new expiration date
    expireDate = new Date(now.getTime() + fetchTokenData.expires_in)

    // updates oauth token
    oauthToken = fetchTokenData.access_token

    return new Promise((resolve, reject) => {
        resolve(fetchTokenData)
    })
    
}

export async function fetchUserData(username: String): Promise<fetchData | null > {

    // updates token if needed
    await checkToken()

    if(!checkToken()) return null

    // twitch api url to fetch user info
    let userUrl = `https://api.twitch.tv/helix/users?login=${username}`

    // fetches user info
    const res = await fetch(userUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${oauthToken}`,
            'Content-Type': 'application/json',
            'client-id': `${TWITCH_CLIENT_ID}`
        }
    })

    return new Promise((resolve, reject) => {
        // if GET ok returns 
        if(res.ok) {
            resolve(res.json())
        }
        resolve(null)
    })
}

var globalBadgesCache = {}

export async function fetchGlobalBadges() {
    
    let url = `https://badges.twitch.tv/v1/badges/global/display`

    const res = await fetch(url)

    return new Promise(async (resolve, reject) => {
        
        if(res.ok) {
            // clears cache
            globalBadgesCache =  {}

            // types incoming data
            let data = (await res.json()) as twitchBadgeData

            // maps data
            globalBadgesCache = data.badge_sets

            // resolves promise with global badges
            resolve(globalBadgesCache)
            return
        }
        
        // resolves promise with cache
        // - can be empty
        console.log('Twitch: Failed to fetch global badges - using cache instead')
        resolve(globalBadgesCache)
    })


}

export async function fetchChannelBadges(twitchID: string) {
    // twitch api url for channel specific badges
    let url = `https://badges.twitch.tv/v1/badges/channels/${twitchID}/display?language=en`

    // fetches channel badges
    const res = await fetch(url)

    return new Promise(async (resolve, reject) => {

        let channelBadges = {}

        if(res.ok) {
            // sets channelBadges to res data
            let data = (await res.json()) as twitchBadgeData

            // maps data
            channelBadges = data.badge_sets

            // resolves promise with channel badges
            resolve(channelBadges)
            return
        }
        // resolves promise
        // - always empty
        console.log('Twitch: Failed to fetch channel badges')
        resolve(channelBadges)
    })
    
}