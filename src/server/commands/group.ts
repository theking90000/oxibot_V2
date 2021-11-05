import { commandType } from "../commands"
import embed from "../utils/embed";
import groups, { createGroup, getGroups, getGroupsUsers } from "../cache/group"
import { selectUser } from "../cache/user"

const command : commandType = {
    name : `group`,

    execute : async (message) => {
            if(!message.args[0] && message.userPerm.hasPermission('command.group')){
                message.channel.send({
                    embeds: [embed({
                        name: message.lang.t(`GroupCommandEmbedDefaultTitle`,),
                        guildid: message.guild.id,
                        fields: [{
                            val1: message.lang.t(`GroupCommandEmbedDefaultList`, { prefix: message.prefix }),
                            val2: message.lang.t(`GroupCommandEmbedDefaultListDescription`, { permission: "command.group.list" })
                        },
                        {
                            val1: message.lang.t(`GroupCommandEmbedDefaultPermission`, { prefix: message.prefix }),
                            val2: message.lang.t(`GroupCommandEmbedDefaultPermissionDescription`, {
                                permission: "command.group.permission"
                            })
                        },
                        {
                            val1: message.lang.t(`GroupCommandEmbedDefaultAdduser`, { prefix: message.prefix }),
                            val2: message.lang.t(`GroupCommandEmbedDefaultAdduserDescription`, {
                                permission: "command.group.permission"
                            })
                        }]
                    }).getEmbed()]
                })
                }

            /**
             * @subcommand list
             * @description affiche la liste des groupes
             * @permission command.group.list
             */
            else if(message.args[0] && message.args[0] === "list" && message.userPerm.hasPermission('command.group.list')){

                let g = getGroups(message.guild.id);
                let x = getGroupsUsers(message.guild.id);

                let em = embed({
                    guildid: message.guild.id,
                    name: message.lang.t("GroupCommandEmbedListTitle", { counter: g.length })
                })

                g.forEach(c => {
                    em.addFields([{
                        val1: message.lang.t('GroupCommandEmbedListGroupName', {
                            groupname: c.name
                        }),
                        val2: message.lang.t('GroupCommandEmbedListGroupValue', {
                            permissions : c.permissions.length,
                            users : x[c.name].members.length,
                        })
                    }])
                })

                message.channel.send({ embeds: [em.getEmbed()] });

            }

            /**
             * @subcommand <groupname>
             * @description handler de sous-commandes
             * @permission null
             */
            else if (message.args[0] && getGroups(message.guild.id).map(c => c.name).includes(message.args[0])){
                const g = getGroups(message.guild.id);
                if(message.args[1]){
                    switch(message.args[1]){
                        /**
                         * @subcommand permission
                         * @description Permet de voir la liste des permissions
                         * @permission command.group.permission
                         */
                        case "permission" : {
                            if(message.userPerm.hasPermission('command.group.permission')){

                                let em = embed({
                                    guildid: message.guild.id, name: message.lang.t('GroupCommandEmbedPermissionTitle', {
                                        groupname: message.args[0]
                                    })
                                });
                
                                let perms = g.find(x => x.name === message.args[0]).permissions
                
                                if (perms.length > 0) {
                                    let f= ""
                                    perms.forEach(x =>{
                                        x= x.replace("*","\\*")
                                        f+=`${x}\n`
                                    } )
                                    em.addFields([{val1 : f}])
                                }
                                    
                                else 
                                    em.addFields([{
                                        val1: message.lang.t('GroupCommandEmbedPermissionNoPerm')
                                    }])
                                message.channel.send({ embeds: [em.getEmbed()] })

                            }
                            }
                            /**
                             * @subcommand adduser
                             * @description Permet de voir la liste des permissions
                             * @permission command.group.permission
                             * @params user
                             */
                            case "adduser" : {
                        if(message.args.length === 3 &&
                        message.userPerm.hasPermission('command.group.user.add')){
                            let user = message.mentions.users.first();
                            if(user) {
                            let us = await selectUser(message.guild.id,user.id)
                       let ugroup = us.getGroups().map(c => c.name)
                       let group = g.find(x => x.name === message.args[0])
    
                        if(group){
                            if(ugroup.includes(group.name)){
                                message.channel.send({
                                    embeds: [embed({
                                        name: message.lang.t("EmbedErrorDefaultTitle"),
                                        guildid: message.guild.id,
                                        fields: [{
                                            val1: message.lang.t('EmbedErrorMessageDefault'),
                                            val2: message.lang.t('GroupCommandAddUserAlreadyInGroup', {
                                                user: `<@${user.id}>`,
                                                groupname: group.name,
                                                tag: user.tag
                                            })
                                        }]
                                    }).getEmbed()]
                                })
                            }
                            else {
                                us.addGroup(group.name)
                                message.channel.send({
                                    embeds: [embed({
                                        name: message.lang.t('GroupCommandEmbedAddUserSuccessTitle'),
                                        guildid: message.guild.id,
                                        fields: [{
                                            val1: message.lang.t('GroupCommandEmbedAddUserSuccess', {
                                                groupname: group.name,
                                            }),
                                            val2: message.lang.t('GroupCommandEmbedAddUserSuccessDescription', {
                                                user: `<@${user.id}>`,
                                                groupname: group.name,
                                                tag: user.tag
                                            })
                                        }]
                                    }).getEmbed()]
                                })
                            }
                        }
                           
                    }
    
                }
                            }

                        }
                    }
                }
                
                    
                
            }

            
            
    }



export default command;