import { commandType } from "../commands"
import embed from "../utils/embed";
import groups, { createGroup, getGroups } from "../cache/group"
import { selectUser } from "../cache/user"

const command : commandType = {
    name : `group`,

    execute : async (message) => {
            if(!message.args[0] && message.userPerm.hasPermission('command.group')){
               message.channel.send(embed({
                   name : "Gérer les groupes",
                   guildid : message.guild.id,
                     fields : [{
                             val1 : `${message.prefix}group list`,
                             val2 : "Renvoie la liste des groupes\n(permission : command.group.list)"
                         },
                         {
                             val1 : `${message.prefix}group <groupe> permission`,
                             val2 : "Voir la liste des permissions du groupe\n(permission : command.group.permission)"
                         },
                         {
                             val1 : `${message.prefix}group <groupe> adduser @mention`,
                             val2 : "ajoute un utilisateur au groupe\n(permission : command.group.adduser)"
                         }]
                    }).getEmbed()) 
                }
            else if(message.args[0] && message.args[0] === "list" && message.userPerm.hasPermission('command.group.list')){

                let g = getGroups(message.guild.id);

                let em = embed({guildid : message.guild.id,name : "Liste des groupes"})

                g.forEach(c => {
                    em.addFields([{val1 : c.name,val2 : `${c.permissions.length} permissions`}])
                })

                message.channel.send(em.getEmbed());

            }
            else if(message.args[0] && getGroups(message.guild.id).map(c => c.name).includes(message.args[0]) &&
            message.args[1] && message.args[1] === "permission" && message.userPerm.hasPermission('command.group.permission')){
                let g = getGroups(message.guild.id);
                let em = embed({guildid : message.guild.id,name : `Permission pour le group ${message.args[0]}` });

                let perms = g.find(x => x.name === message.args[0]).permissions

                if(perms){
                    let f= ""
                    perms.forEach(x =>{
                        x= x.replace("*","\\*")
                        f+=`${x}\n`
                    } )
                    em.addFields([{val1 : f}])
                }
                    
                else 
                    em.addFields([{val1 : "Il n'y a pas de permissions"}])
                message.channel.send(em.getEmbed())
            }
            else if(message.args[0] && getGroups(message.guild.id).map(c => c.name).includes(message.args[0]) &&
            message.args[1] && message.args[1] === "adduser" &&  message.args[2] && message.args.length === 3 &&
             message.userPerm.hasPermission('command.group.user.add')){
                let user = message.mentions.users.first();
                if(user) {
                   let g = getGroups(message.guild.id);
                   let us = await selectUser(message.guild.id,user.id)
                   let ugroup = us.getGroups().map(c => c.name)
                   let group = g.find(x => x.name === message.args[0])
                    console.log(ugroup)
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
    }
}



export default command;