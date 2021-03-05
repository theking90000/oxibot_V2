import client from "../index";
import {getUsers,addUser}  from "../cache/user";
import * as chalk from "chalk"


client.on('guildMemberAdd', async (member) => {
    let users = getUsers(member.guild.id);
    if(!users.map(x => x.userID).includes(member.id) && !member.user.bot){
        await addUser({guildID : member.guild.id, userID : member.id,Groups : []})
        console.log(chalk.green('Création de l\'utilisateur pour la guild ' + member.guild.name))
    }
})