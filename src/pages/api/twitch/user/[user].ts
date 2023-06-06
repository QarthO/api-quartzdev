import type { NextApiRequest, NextApiResponse } from 'next'
import * as apiTwitch from '@/utils/api/twitch'
import * as apiFfz from '@/utils/api/ffz'
import * as api7tv from '@/utils/api/7tv'
import * as apiBttv from '@/utils/api/bttv'

type apiResponseData = {
  username: string
  displayname: string
  id: string
  pfp: string
  emotes: object
  badges: object
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // URL: /api/twitch/user/{user}
    const { user } = req.query

    let username: string = user as string

    let rawUserData = await apiTwitch.fetchUserData(username)

    let twitchData = rawUserData.data[0]
    
    // checks if user exists
    if(!twitchData) {
      res.status(404).send(`User '${username}' not found`)
      return
    }
    
    let [
      twitchGlobalBadges, twitchChannelBadges,
      bttvGlobalEmotes, bttvChannelEmotes,
      ffzChannelEmotes,
      seventvGlobalEmotes, seventvChannelEmotes
      ] = await Promise.all([
        apiTwitch.fetchGlobalBadges(), apiTwitch.fetchChannelBadges(twitchData.id),
        apiBttv.fetchGlobalEmotes(), apiBttv.fetchChannelEmotes(twitchData.id),
        apiFfz.fetchChannelEmotes(twitchData.id),
        api7tv.fetchGlobalEmotes(), api7tv.fetchChannelEmotes(twitchData.id)
    ])

    let responseData: apiResponseData = {
      username: username,
      displayname: twitchData.display_name,
      pfp: twitchData.profile_image_url,
      id: twitchData.id,
      emotes: {
        bttv: {
          global: bttvGlobalEmotes,
          channel: bttvChannelEmotes,
        },
        ffz: {
          channel: ffzChannelEmotes,
        },
        seventv: {
          global: seventvGlobalEmotes,
          channel: seventvChannelEmotes,
        }
      },
      badges: {
        global: twitchGlobalBadges,
        channel: twitchChannelBadges,
      },
    }

    //  sends api response data
    res.status(200).json(responseData)
  };