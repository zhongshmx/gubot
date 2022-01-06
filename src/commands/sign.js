const Group = require("../model/group");

module.exports = class ReinforcementHandler {
    async handle(ctx) {
        let action = ctx.args.action;
        if (action == 'list') {
            return await this.info(ctx);
        } else if (action == 'add') {
            return await this.add(ctx);
        } else if (action == 'delete') {
            return await this.delete(ctx)
        }
    }

    async info(ctx) {
        let args = ctx.args;
        let group_id = ctx.data.group_id;
        let group = await Group.findOne({
            where: {
                group_id: group_id
            }
        });
        if (args.sign) {
            if (group.members.indexOf(args.sign) > -1) {
                return `存在 ${args.sign} 的记录`;
            }
            return `没有 ${args.sign} 的记录`;
        }
        return `记录列表：\n${group.members}`;
    }

    async add(ctx) {
        let args = ctx.args;
        let group_id = ctx.data.group_id;
        let group = await Group.findOne({
            where: {
                group_id: group_id
            }
        });
        if (group.members != '' && group.members == null) {
            group.members = `${args.sign}`;
        } else if (group.members.indexOf(args.sign) < 0){
            group.members = `${group.members},${args.sign}`;
        }
        group.save();
        return '添加记录成功';
    }

    async delete(ctx) {
        let args = ctx.args;
        let group_id = ctx.data.group_id;
        let group = await Group.findOne({
            where: {
                group_id: group_id
            }
        });
        if (group.members != '' && group.members != null && group.members.indexOf(args.sign) > -1) {
            group.members = group.members.replace(`,${args.sign}`, '');
            group.save();
            return '删除记录成功';
        } else {
            return `删除记录失败，没有找到${args.sign}的记录`;
        }
    }

    static argsList() {
        return {
            action: {
                name: 'action',
                alias: 'alias_action',
                displayName: '记录',
                type: 'string',
                defaultIndex: 1,
                shortArgs: null,
                longArgs: 'action',
                limit: ['list', 'add', 'delete'],
                nullable: true,
                default: 'list'
            },
            branch: {
                list: [{
                    name: 'sign',
                    alias: null,
                    displayName: '记录',
                    type: 'string',
                    defaultIndex: 2,
                    shortArgs: null,
                    longArgs: 'sign',
                    limit: null,
                    nullable: true,
                    default: null
                }],
                add: [{
                    name: 'sign',
                    alias: null,
                    displayName: '记录',
                    type: 'string',
                    defaultIndex: 2,
                    shortArgs: null,
                    longArgs: 'sign',
                    limit: null,
                    nullable: false,
                    default: null
                }],
                delete: [{
                    name: 'sign',
                    alias: null,
                    displayName: '记录',
                    type: 'string',
                    defaultIndex: 2,
                    shortArgs: null,
                    longArgs: 'sign',
                    limit: null,
                    nullable: false,
                    default: null
                }]
            }
        };
    }
}
