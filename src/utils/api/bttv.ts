type bttvEmote = {
    id: number
    user: {
        id: number
        name: string
        displayName: string
    }
    code: string
    images: {}
    imageType: string
    animated: boolean
    modifier: boolean
}

type bttvUserData = {
    id: string
    bots: [string]
    avatar: string
    channelEmotes: [bttvEmote]
    sharedEmotes: [bttvEmote]
}

// global emotes cache
var globalEmotesCache = {}

export async function fetchGlobalEmotes() {
    let url = `https://api.betterttv.net/3/cached/emotes/global`

    const res = await fetch(url)

    return new Promise(async (resolve, reject) => {
        
        if(res.ok) {

            // clears cache
            globalEmotesCache = {}
            
            // types incoming data
            let data = (await res.json()) as [bttvEmote]
            
            // updates cache
            Object.assign(globalEmotesCache, ...data.map((emote) => ({[emote.code]: emote.id})))
            
            // resolves promise with bttv emotes
            resolve(globalEmotesCache)
            return
        }
        console.log('BTTV: Failed to fetch global emotes - using cache instead')
        // resolves promise with cached emotes - cache can be empty if never fetched
        resolve(globalEmotesCache)
    })
}

export async function fetchChannelEmotes(twitchID: string) {
    let url = `https://api.betterttv.net/3/cached/users/twitch/${twitchID}`

    const res = await fetch(url)

    return new Promise(async (resolve, reject) => {
        
        let channelEmotes = {}

        // if fetch successful 
        if(res.ok) {
            
            // types incoming data
            let data = (await res.json()) as bttvUserData

            // maps data
            Object.assign(channelEmotes, ...data['channelEmotes'].map((emote) => ({[emote.code]: emote.id})))
            Object.assign(channelEmotes, ...data['sharedEmotes'].map((emote) => ({[emote.code]: emote.id})))
            
            // resolves promise with formatted emotes
            resolve(channelEmotes)
            return
        }
        // resolves promise with empty emotes
        console.log('BTTV: Failed to fetch channel emotes')
        resolve(channelEmotes)
    })
}