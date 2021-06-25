const Jx3box = require('../service/httpApi/jx3box');
const serendipityMap = require('@jx3box/jx3box-data/data/serendipity/serendipity.json')
const moment = require('moment');
const fs = require('fs-extra');

module.exports = class SerendipityHandler {
    async handle(ctx) {
        //get args from state
        let args = ctx.args;
        let redis_key = JSON.stringify('Serendipity:' + JSON.stringify(args));
        //get data from redis
        let result = await bot.redis.get(redis_key);
        //check data is empty?
        if (result == null || !await fs.exists(result) || args['update']) {
            let serendipity = args.serendipity;
            if (serendipity != '全部奇遇') {
                serendipity = serendipityMap
                    .filter(s => ((s.name == args.serendipity || s.type == args.serendipity) && s.languages[0] == 'zhcn'))
                    .map(x => x.name).join(',');
            } else {
                serendipity = serendipityMap
                    .filter(s => s.languages[0] == 'zhcn')
                    .map(x => x.name).join(',');
            }
            if(serendipity == '') {
                throw `错误: 未知的奇遇类型 [${serendipity}]`
            }
            let searchKey = {
                server: args.server,
                role: args.player,
                serendipity: serendipity
            }
            let datas = await Jx3box.serendipity(searchKey);
            searchKey.serendipity = args.serendipity;
            let renderData = {
                dataSource: 'JX3BOX',
                search: searchKey,
                time: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
                datas: datas
            };
            result = bot.imageGenerator.generateFromTemplateFile('serendipity', renderData, {
                selector: 'body'
            });
            await bot.redis.set(redis_key, result);
            await bot.redis.expire(redis_key, 300);
        } 
        return `[CQ:image,file=file://${result}]`;
    }

    static argsList() {
        return [
            {
                name: 'player',
                alias: null,
                displayName: '角色名',
                type: 'string',
                defaultIndex: 1,
                shortArgs: null,
                longArgs: 'flower',
                limit: null,
                nullable: true,
                default: '全部玩家'
            },
            {
                name: 'serendipity',
                alias: 'serendipity',
                displayName: '奇遇名称',
                type: 'string',
                defaultIndex: 2,
                shortArgs: null,
                longArgs: 'server',
                limit: null,
                nullable: true,
                default: '绝世奇遇'
            }, 
            {
                name: 'server',
                alias: 'server',
                displayName: '服务器',
                type: 'server',
                defaultIndex: 3,
                shortArgs: null,
                longArgs: 'map',
                limit: null,
                nullable: true,
                default: '-'
            }
        ];
    }
}