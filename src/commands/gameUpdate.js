const fs = require('fs-extra')
const fonts = require('../../env.json').image_fonts;
const CqHttp = require('../service/cqhttp');

module.exports = class ServerStatusHandler {
    async handle(ctx) {
        //get args from state
        let redis_key = 'GameUpdate';
        //get data from redis
        let result = await bot.redis.get(redis_key);

        //check data is empty?
        if (!result || !await fs.exists(result)) {
            result = await bot.imageGenerator.getFromUrl('https://jx3.xoyo.com/launcher/update/latest.html', { selector: 'body div:first-of-type', evaluate: `document.querySelector('body div:first-of-type').style.width = '720px';document.querySelector('body div:first-of-type').style.padding = '2rem';document.querySelectorAll('body span').forEach(x => x.style.fontFamily = "${fonts || "'Noto Sans SC', sans-serif, 'consolas'"}")`});
            await bot.redis.set('GameUpdate', result);
            await bot.redis.expire('GameUpdate', 600);
        }

        return CqHttp.imageCQCode(result);
    }

    static argsList() {
        return [{
            name: 'update',
            alias: null,
            displayName: '刷新缓存',
            type: 'boolean',
            defaultIndex: 1,
            shortArgs: 'u',
            longArgs: 'update',
            limit: null,
            nullable: true,
            default: false
        }];
    }
}
