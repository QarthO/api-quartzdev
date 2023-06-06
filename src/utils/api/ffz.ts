type ffzEmote = {
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
export async function fetchChannelEmotes(twitchID: string) {
    // ffz api url
    let url = `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${twitchID}`

    // fetches channel emotes
    const res = await fetch(url)

    // returns promise
    return new Promise(async (resolve, reject) => {
        // channel emotes object
        let channelEmotes = {}

        // if fetch successful
        if(res.ok) {
            // stores data as ffzEmote list
            let data = (await res.json()) as [ffzEmote]

            // maps emotes to channelEmotes
            Object.assign(channelEmotes, ...data.map((emote) => ({[emote.code]: emote.id})))

            // resolves promise with channel emotes
            resolve(channelEmotes)
            return
        }
        // resolves promise with cached emotes - cache can be empty if never fetched
        console.log('ffz: Failed to fetch global emotes - Using cache instead')
        reject(channelEmotes)
    })
    
}