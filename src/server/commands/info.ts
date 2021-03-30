import { commandType } from "../commands";
import embed from "../utils/embed";
import { cpus } from "os"
import client, { version } from "..";
const pidusage = require('pidusage')


const command : commandType = {

    name : "info",
    execute : async (message) => {
        const args = message.args[0] || "";
        switch(args){
            /**
             * @subcommand process
             * @description affiche les informations relatives au processus
             * @permission command.info.process
             */
            case "process" : {
                if(!message.userPerm.hasPermission('command.info.process')) return;
                    
                    const mem = process.memoryUsage().heapUsed
                    const cpu = await pidusage(process.pid)

                    const em = embed({
                        guildid: message.guild.id,
                        name : message.lang.t("InfoCommandEmbedProcessTitle"),
                        fields : [{
                            val1 : message.lang.t("InfoCommandEmbedProcessRam"),
                            val2 : message.lang.t("InfoCommandEmbedProcessRamDescription",{
                                ram_used_formated : Math.round(mem / 1024 / 1024) + "MB",
                                ram_used : Math.round(mem / 1024 / 1024),
                                ram_used_raw : mem,
                            }),
                        },{
                            val1 : message.lang.t("InfoCommandEmbedProcessCpu"),
                            val2 : message.lang.t("InfoCommandEmbedProcessCpuDescription",  {
                                cpu_used_formated : (cpu.cpu as Number).toFixed(2) || 0,
                                cpu_used_raw : cpu.cpu
                            })
                        }, {
                            val1 : message.lang.t("InfoCommandEmbedCpuModel"),
                            val2 : message.lang.t("InfoCommandEmbedCpuModelDescription", {
                                cpu_model : cpus()[0].model
                            })
                        },{
                            val1 : message.lang.t("InfoCommandEmbedUptime"),
                            val2 : message.lang.t('InfoCommandEmbedUptimeDescription', {
                                time_formated : "%uptime%",
                                time_raw : process.uptime()
                            })
                        }]
                        
                    })

                    message.channel.send(em.getEmbed())

                break;
            }
            /**
             * @command info
             * @description affiche les informations du bot
             * @permission command.info
             */
            default : {
                if(!message.userPerm.hasPermission("command.info")) return;

                const em = embed({
                    guildid : message.guild.id,
                    name : message.lang.t("InfoCommandEmbedDefaultTitle"),
                    fields : [{
                        val1 : message.lang.t("InfoCommandEmbedDefaultVersion"),
                        val2 : message.lang.t("InfoCommandEmbedDefaultVersionDescription",{
                            version
                        })
                    }, {
                        val1 : message.lang.t("InfoCommandEmbedDefaultGithub"),
                        val2 : "[https://github.com/theking90000/oxibot_V2](https://github.com/theking90000/oxibot_V2/)"
                    }, {
                        val1 : message.lang.t("InfoCommandEmbedDefaultServers"),
                        val2 : message.lang.t("InfoCommandEmbedDefaultServersDescription", {
                            servers : client.guilds.cache.size
                        })
                    }, {
                        val1 : message.lang.t("InfoCommandEmbedDefaultMembers"),
                        val2 : message.lang.t("InfoCommandEmebedDefaultMembersDescription" , {
                            users : await getUniqueMembers()
                        })
                    },]
                })

                return message.channel.send(em.getEmbed())

            }

        }

    }

}

async function getUniqueMembers(){
    const final = []
    for(const [id,guild] of client.guilds.cache){
        for(const [idm,member] of (await guild.members.fetch())){
            if(!final.includes(idm) && !member.user.bot) final.push(idm)
        }
    }
    return final.length;
}

export default command;