type seventvEmote = {
    id: string
    name: string
}

type bttvEmoteSet = {
    id: string
	name: string
	flags: number
	tages: []
	immutable: boolean
	privileged: boolean
    emotes: [seventvEmote]
    emote_count: number
    capacity: number
    owner: {}
}

type bttvChannelInfo = {
    id: string
    platform: string
    username: string
    display_name: string
    linked_at: number
    emote_capacity: number
    emote_set_id: string
    emote_set: bttvEmoteSet
    user: {}
}

var globalEmotesCache = {}

export async function fetchGlobalEmotes() {
    // 7tv api url for global emotes
    let url = `https://7tv.io/v3/emote-sets/62cdd34e72a832540de95857`

    // fetch global emotes
    const res = await fetch(url)

    // returns promise
    return new Promise(async (resolve, reject) => {
        // if fetech successful
        if(res.ok) {
            // clear cacche
            let globalEmotesCache = {}

            // types incoming data
            let data = (await res.json()) as bttvEmoteSet
            Object.assign(globalEmotesCache, ...data['emotes'].map((emote) => ({[emote.name]: emote.id})))
            resolve(globalEmotesCache)
            return
        }
        console.log('7tv: Failed to fetch global emotes - Using cache instead')
        // resolves promise with cached emotes - cache can be empty if never fetched
        resolve(globalEmotesCache)
    })
}

export async function fetchChannelEmotes (twitchID: string) {
    let url = `https://7tv.io/v3/users/twitch/${twitchID}`

    const res = await fetch(url)

    return new Promise(async (resolve, reject) => {

        let channelEmotes = {}
        // if GET ok returns 
        if(res.ok) {
            let data = (await res.json()) as bttvChannelInfo
            Object.assign(channelEmotes, ...data['emote_set']['emotes'].map((emote) => ({[emote.name]: emote.id})))
            resolve(channelEmotes)
            return
        }
        // resolves promise with no emotes
        console.log('7tv: Failed to fetch channel emotes')
        resolve(channelEmotes)
    })
    
}