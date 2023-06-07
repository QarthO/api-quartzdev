Custom REST API for twichat

Pull all of relevant user info for twitch.tv in one simple request
- twitch global badges
- twitch channel specific badges
- bttv global emotes
- bttv channel specific and shared emotes
- ffz channel specific emotes
- 7tv global emotes
- 7tv channel specific emotes

Use case:

```GET /twitch/user/{username}```

Where ``username`` is a twitch username

Currently live on quartzdev.gg

Example:

```GET api.quartzdev.gg/twitch/user/qartho```

![image](https://github.com/QarthO/api-quartzdev/assets/10179096/268ca848-e069-4552-a8bb-d5f864cb3e96)

