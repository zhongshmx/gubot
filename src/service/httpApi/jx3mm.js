const { $jx3mm } = require('./axios');

class Jx3mm{
    static apiDisplayName = 'JX3API';

    static async serendipity(params) {
        params = Object.assign({
            start: 0,
            pageIndex: 1,
            pageSize: 50
        }, params);
        let response = await $jx3mm.get(`/home/qyinfo`, {params: params});
        if (response.data.code == '200') {
            return response.data.result;
        } else {
            throw `错误：[${Jx3mm.apiDisplayName}]的接口[next/serendipity]返回异常，请检查参数`;
        }
    }
}

module.exports = Jx3mm;
