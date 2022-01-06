const { $jx3api } = require('./axios');

class Jx3api{
    static apiDisplayName = 'JX3API';

    static async strengthen(xf) {
        let response = await $jx3api.get('/app/strengthen', {params:{
            name: xf || "冰心诀"
        }});
        if(response.data.code == 200) {
            let data = response.data.data;
            return {
                增强小药: data.heightenDrug,
                增强小吃: data.heightenFood,
                辅助小药: data.auxiliaryDrug,
                辅助小吃: data.auxiliaryFood
            }
        }else{
            throw `错误：[${Jx3api.apiDisplayName}]的接口[strengthen]返回值异常，请检查参数。`;
        }
    }

    static async gest(xf) {
        let response = await $jx3api.get('/app/gest', {params:{
            name: xf || "冰心诀"
        }});
        if(response.data.code == 200) {
            let data = response.data.data;
            return {
                name: data.name,
                time: response.data.time * 1000,
                eye: data.skillName,
                一重粗识: data.descs[0].desc,
                二重略懂: data.descs[1].desc,
                三重巧熟: data.descs[2].desc,
                四重精妙: data.descs[3].desc,
                五重游刃: data.descs[4].desc,
                六重忘我: data.descs[5].desc,
                七重归一: '空'
            }
        }else{
            throw `错误：[${Jx3api.apiDisplayName}]的接口[gest]返回值异常，请检查参数。`;
        }
    }

    static async travel(map) {
        let response = await $jx3api.get('/app/travel', {params:{
            map: map || "七秀"
        }});
        if(response.data.code == 200) {
            let data = response.data.data;
            let result =  {
                time: response.data.time * 1000,
                data: []
            }
            for(let i in data){
                let cur = data[i];
                result.data.push({
                    name: cur.name,
                    geomantic: cur.geomanticScore,
                    hard: cur.hardScore,
                    view: cur.viewScore,
                    practical: cur.practicalScore,
                    interesting: cur.interestingScore,
                    source: cur.source,
                    quality: cur.qualityLevel,
                    levelLimit: cur.levelLimit,
                    image_url: cur.imagePath,
                    tip: cur.tip.replace(/\n/g, '<br />')
                });
            }
            return result;
        }else{
            throw `错误：[${Jx3api.apiDisplayName}]的接口[travel]返回值异常，请检查参数。`;
        }
    }

    static async saohua() {
        let response = await $jx3api.get('/app/random');
        if(response.data.code == 200) {
            let result = response.data.data.text;
            return result;
        }else{
            throw `错误：[${Jx3api.apiDisplayName}]的接口[random]返回值异常。`;
        }
    }

    static async daily(server) {
        let response = await $jx3api.get('/app/daily', {params:{
            server: server || "唯我独尊",
        }});
        if(response.data.code == 200) {
            let data = response.data.data;
            let result = {
                时间: data.DateTime,
                星期: data.Week,
                秘境日常: data.DayWar,
                驰援任务: data.DayCommon,
                阵营日常: data.DayCamp,
                美人图: data.DayDraw || '（今天不画）',
                战场首胜: data.DayBattle,
                周常五人本: data.WeekFive,
                周常十人本: data.WeekTeam,
                周公共日常: data.WeekCommon
            };
            return result;
        }else{
            throw `错误：[${Jx3api.apiDisplayName}]的接口[daily]返回值异常，请检查参数。`;
        }
    }

    static async gold(server){
        let response = await $jx3api.get('/app/gold', {params:{
            server: server || "唯我独尊",
        }});
        if(response.data.code == 200) {
            let data = response.data;
            return {
                time: data.time * 1000,
                server: data.data.server,
                5173: data.data['5173'],
                7881: data.data['7881'],
                dd373: data.data['dd373'],
                uu898: data.data['uu898'],
                万宝楼: data.data['wanbaolou']
            }
        }else{
            throw `错误：[${Jx3api.apiDisplayName}]的接口[gold]返回值异常，请检查参数。`;
        }
    }

    static async furniture(name) {
        let response = await $jx3api.get(`/app/furniture`, {params:{
            name: name
        }});
        if (response.data.code == 200) {
            let data = response.data.data;
            return {
                name: data.name,
                geomantic: data.geomanticScore,
                hard: data.hardScore,
                view: data.viewScore,
                practical: data.practicalScore,
                interesting: data.interestingScore,
                source: data.source,
                quality: data.quality,
                levelLimit: data.levelLimit,
                image_url: data.imagePath,
                tip: data.tip.replace(/\n/g, '<br />')
            };
        } else {
            throw `错误：[${Jx3api.apiDisplayName}]的接口[serendipity]返回异常，请检查参数`;
        }
    }

    static async equips(params) {
        let response = await $jx3api.get(`/item/equips`, {params:params});
        if (response.data.code == 200) {
            let data = response.data.data;
            console.log('data', data);
            return {
                name: data.name,
                geomantic: data.geomanticScore,
                hard: data.hardScore,
                view: data.viewScore,
                practical: data.practicalScore,
                interesting: data.interestingScore,
                source: data.source,
                quality: data.quality,
                levelLimit: data.levelLimit,
                image_url: data.imagePath,
                tip: data.tip.replace(/\n/g, '<br />')
            };
        } else {
            throw `错误：[${Jx3api.apiDisplayName}]的接口[serendipity]返回异常，请检查参数`;
        }
    }

    static async macro(name) {
        let response = await $jx3api.get('/app/macro', {params:{
            name: name
        }});
        let data = response.data;
        if(data.code != 200) {
            throw `错误：[${Jx3api.apiDisplayName}]的接口[macro]返回异常，请检查参数`;
        }
        data = data.data;
        return {
            name: data.name,
            talents: data.plan,
            content: data.command,
            time: response.data.time
        }
    }

    static async seniority(params) {
        let response = await $jx3api.get(`/app/seniority`, {params: params});
        if (response.data.code == 200) {
            return response.data.data.map((data) => ({
                avatar: `${__dirname}/../../assets/images/school/${data.sect}.png`,
                school: data.sect,
                role: data.role,
                score: data.value,
                server: data.server
            })).slice(0, 25);
        } else {
            throw `错误：[${Jx3api.apiDisplayName}]的接口[seniority]返回异常，请检查参数`;
        }
    }
}

module.exports = Jx3api;
