import type { NextApiRequest, NextApiResponse } from "next";

type apiResponseData = {
  username: string;
  id: number | null;
};

type DiscordUser = {
  avatar: string | null;
  banner: string | null;
  communication_disabled_until: string | null;
  flags: number;
  joined_at: string;
  nick: string | null;
  pending: boolean;
  premium_since: string | null;
  roles: string[];
  unusual_dm_activity_until: string | null;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    public_flags: number;
    flags: number;
    banner: string | null;
    accent_color: string | null;
    global_name: string | null;
    avatar_decoration_data: {
      asset: string;
      sku_id: string;
      expires_at: string | null;
    } | null;
    banner_color: string | null;
    clan: string | null;
    primary_guild: string | null;
  };
  mute: boolean;
  deaf: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // URL: /api/twitch/user/{user}
  const { username } = req.query;

  let usernameToFind: string = username as string;

  let rawUserData = await fetchUserId(usernameToFind);

  //  sends api response data
  res.status(200).json(rawUserData);
}

const GUILD_ID = "1022551403941613661";
const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members?limit=1000`;
const API_TOKEN = process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN;

async function fetchUserId(usernameToFind: String) {
  // fetch global emotes
  //

  // returns promise
  return new Promise(async (resolve, reject) => {
    let res = await alwaysFetch();
    if (res == null) {
      resolve(null);
      return;
    }
    // if fetech successful
    if (!res.ok) {
      resolve(null);
      return;
    }

    // types incoming data
    let data = (await res.json()) as DiscordUser[];

    const member = data.find(
      (user) =>
        user.user &&
        user.user.username &&
        user.user.username.toString().toLowerCase() ===
          usernameToFind.toString().toLowerCase(),
    );

    if (!member) {
      resolve(null);
      return;
    }

    let response: apiResponseData = {
      username: member.user.username,
      id: Number(member.user.id),
    };
    resolve(response);
  });
}

async function alwaysFetch() {
  try {
    return fetchWithTimeout(url, {
      method: "GET",
      headers: {
        Authorization: `Bot ${API_TOKEN}`,
      },
    });
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 5000, // Timeout in milliseconds
): Promise<Response | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  options.signal = controller.signal;

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    clearTimeout(id); // Cleanup the timeout
  }
}
