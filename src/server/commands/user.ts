import { commandType } from "../commands"
import embed from "../utils/embed";
import groups, { createGroup, getGroups } from "../cache/group"
import { selectUser } from "../cache/user"

const command : commandType = {
    name : `user`,

    execute : (message) => {

        if(!message.args[0] && message.userPerm.hasPermission('command.user')){

            message.channel.send(embed({
                name : "Gérer les utilisateur",
                guildid : message.guild.id,
                  fields : [{
                          val1 : `${message.prefix}user @user info`,
                          val2 : "Renvoie les informations sur l'utilisateur\n(permission : command.user.info)"
                      },
                      {
                        val1 : `${message.prefix}user @user addgroup <group>`,
                        val2 : "Ajoute un groupe a l'utilisateur \n(permission : command.user.addgroup)"
                    },
                    {
                        val1 : `${message.prefix}user @user removegroup <group>`,
                        val2 : "Retire un groupe a l'utilisateur \n(permission : command.user.removegroup)"
                    }
                    ]}).getEmbed())
                

        }
        if(message.args.length === 2 && message.args[1] === "info" && message.userPerm.hasPermission('command.user.info')){

            let user = message.mentions.users.first();
            if(user){
            let u2 = selectUser(message.guild.id,user.id)
            let x : string = "" 
            u2.getGroups().forEach(c => {
                x += c.name +"\n"
            })
            message.channel.send(embed({
                name : `Info de l'utilisateur`,
                guildid : message.guild.id,
                  fields : [{
                          val1 : `Groupes :`,
                          val2 : x === "" ? "Aucun groupe !" : x
                      },
                    ]}).getEmbed()
                    .setAuthor(user.tag,user.displayAvatarURL({ dynamic : true, }))
                    
                    )
                
                }
        }
        else if(message.args.length === 3 && getGroups(message.guild.id).map(c => c.name).includes(message.args[2]) &&
        message.args[1] === "addgroup"  &&  
             message.userPerm.hasPermission('command.user.group.add')){
                let user = message.mentions.users.first();

                if(user) {
                    
                   let g = getGroups(message.guild.id);
                   let us = selectUser(message.guild.id,user.id)
                   let ugroup = us.getGroups().map(c => c.name)
                   let group = g.find(x => x.name === message.args[2])

                    if(group){
                        if(ugroup.includes(group.name)){
                            message.channel.send(embed({
                                name : "Erreur !",
                                guildid : message.guild.id,
                                fields : [{
                                    val1 : `Une erreur est survenue`,
                                    val2 : `<@${user.id}> est déja dans le groupe ${group.name}`
                                }]
                            }).getEmbed())
                        }
                        else {
                            us.addGroup(group.name)
                            message.channel.send(embed({
                                name : "Utilisateur ajouté !",
                                guildid : message.guild.id,
                                fields : [{
                                    val1 : `Nouveau membre du groupe ${group.name}`,
                                    val2 : `<@${user.id}> est désormais dans le groupe ${group.name}`
                                }]
                            }).getEmbed())
                        }
                    }
                       
                }

            }
            else if(message.args.length === 3 && getGroups(message.guild.id).map(c => c.name).includes(message.args[2]) &&
        message.args[1] === "removegroup"  &&  
             message.userPerm.hasPermission('command.user.group.remove')){
                let user = message.mentions.users.first();

                if(user) {
                    
                   let g = getGroups(message.guild.id);
                   let us = selectUser(message.guild.id,user.id)
                   let ugroup = us.getGroups().map(c => c.name)
                   let group = g.find(x => x.name === message.args[2])

                    if(group){
                        if(!ugroup.includes(group.name)){
                            message.channel.send(embed({
                                name : "Erreur !",
                                guildid : message.guild.id,
                                fields : [{
                                    val1 : `Une erreur est survenue`,
                                    val2 : `<@${user.id}> n'est pas dans le groupe ${group.name}`
                                }]
                            }).getEmbed())
                        }
                        else {
                            us.removeGroup(group.name)
                            message.channel.send(embed({
                                name : "Utilisateur retiré !",
                                guildid : message.guild.id,
                                fields : [{
                                    val1 : `Un membre a quitté le ${group.name}`,
                                    val2 : `<@${user.id}> n'est plus dans le groupe ${group.name}`
                                }]
                            }).getEmbed())
                        }
                    }
                       
                }

            }

    }
}

export default command