import { CategoryChannel, Collection, GuildChannel, Message, Permissions, TextChannel } from "discord.js";
import { commandType } from "../commands"
import embed from "../utils/embed";

const command : commandType = {
    name : `clear`,
    settings : {
        canBeDisabled : true,
        data : {
            logchannel : {
                type : "string",
                value : "LOGS"
            },
            logChannelEnabled : {
                type : "boolean",
                value : true,
            },
            TEST : {
                type : "boolean",
                value : true,
            }
        }
    },
    execute : async (message) => {

        if(!message.args[0] && message.userPerm.hasPermission('command.clear')){
            message.channel.send(embed({
                name : "Clear un channel",
                guildid : message.guild.id,
                    fields : [
                    {
                        val1 : `${message.prefix}clear [0-100]`,
                        val2 : "Clear de 0 à 100 messages dans un channel\n(permission : command.clear)",
                    },
                    {
                        val1 : `${message.prefix}clear duplicate`,
                        val2 : "Clear les messages dupliqué (limite de 100 messages)\n(permission : command.clear.duplicate)",
                    },
                    {
                        val1 : `${message.prefix}clear channel`,
                        val2 : "Supprime le channel et le récrée a nouveau\n(permission : command.clear.channel)",
                    }
                ]
            }).getEmbed())
        }

        else if (message.args[0] && message.userPerm.hasPermission('command.clear')){

            const channel = message.channel as TextChannel

            switch(message.args[0]){

                case "duplicate" : {
                    if(!message.userPerm.hasPermission('command.clear.duplicate')) return;
                    const Deletable = await GetDeletableMessage({channel ,limit :100})
                    const duplicatetext = [];

                    channel.bulkDelete(Deletable.filter(msg => {
                        if(!duplicatetext.includes(msg.content)){
                            duplicatetext.push(msg.content)
                            return false;
                        }
                        return !(msg.id === message.id)
                    }))
                    break;
                }

                case "channel" : {
                    if(!message.userPerm.hasPermission('command.clear.channel')) return;
                    
                    const channel = message.channel as TextChannel;
                    const position = channel.position
                    const new_ch = await channel.clone({reason : `${message.author.tag} cleared channel`})

                    if(message.data.logChannelEnabled.value === true){
                        var cat : CategoryChannel
                        if(!message.guild.channels.cache.find(
                            x => x.name.toLowerCase() === message.data.logchannel.value.toLowerCase() && x.type === "category"
                            )){
                           cat = (await message.guild.channels.create(message.data.logchannel.value,{
                            type : "category"
                           })) 
                        }
                        else cat = message.guild.channels.cache.find(
                            x => x.name.toLowerCase() === message.data.logchannel.value.toLowerCase() && x.type === "category")  as CategoryChannel
                        await channel.setParent(cat)
                        await channel.createOverwrite(message.guild.roles.everyone,{ VIEW_CHANNEL : false,})
                    }else{
                        await message.channel.delete();
                    }

                    await new_ch.setPosition(position);

                    return;
                }

                default : {
                    const n = parseInt(message.args[0])

                    if(!n){
                        message.channel.send(embed({
                            name : `Une erreur est survenue !`,
                            guildid : message.guild.id,
                            fields :  [
                                {
                                    val2 : `Veuillez inclure un nombre`,
                                    val1 : `Erreur ! `
                                }
                            ]
                        }).getEmbed())

                        return
                    }

                    if(n < 0 || n > 100){
                        message.channel.send(embed({
                            name : `Une erreur est survenue !`,
                            guildid : message.guild.id,
                            fields :  [
                                {
                                    val2 : `Veuillez inclure un nombre entre 1 et 100 !`,
                                    val1 : `Erreur ! `
                                }
                            ]
                        }).getEmbed())

                        return
                    }

                    const messagesToDelete = await (await GetDeletableMessage({channel,limit : n}))
                    .filter(msg => !(msg.id === message.id))
                    channel.bulkDelete(messagesToDelete)

                    }
                }

            }

        }
    }

const GetDeletableMessage = async (info : { channel: TextChannel,limit : number }) : Promise<Collection<string,Message>> => {
    if(info.limit > 100) return new Collection<string,Message>()

    const DateMax = new Date();
    DateMax.setDate(DateMax.getDate() - 14);

    const messages = await info.channel.messages.fetch({ limit : info.limit})

    return messages.filter(message => message.deletable && message.createdTimestamp > DateMax.getTime())
}

export default command;