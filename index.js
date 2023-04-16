const { Client, Intents } = require('discord.js');
const client = new Client({ intents: Object.values(Intents.FLAGS) });
const prefix = '-'; // Prefixo dos comandos
const ticketCategoryID = '1021170212361490553'; // ID da categoria onde os tickets serão criados
require('dotenv').config();
client.on('ready', () => {
  console.log(`Bot iniciado como ${client.user.tag}!`);
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'relatorio') {
    // Cria o canal de texto para o ticket
    const ticketCategory = client.channels.cache.get(ticketCategoryID);
    const channelName = `relatorio-${message.author.username}`;
    const channel = await message.guild.channels.create(channelName, {
      type: 'text',
      parent: ticketCategory,
      topic: `Ticket criado por ${message.author.tag}`,
      permissionOverwrites: [
        {
          id: message.author.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
        },
        {
          id: message.guild.roles.everyone,
          deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
        },
      ],
    });

    // Envia uma mensagem com as perguntas para o usuário
    var questions = ['Horário do relatório:', 'Qual é o seu nick?', 'Chefe assumindo Hall 1:', 'Chefe(s) assumindo Hall 2:','Chefe(s) assumindo Hall 3:','Chefe(s) assumindo Hall 4:','Chefe assumindo Comando Geral:','Chefe assumindo Comando Auxiliar:','Chefe assumindo Auxilio do Hall1:', 'Chefe(s) na sala Promocional ou Treinamento:', 'Ouvidora:'];
const answers = [];
for (let i = 0; i < questions.length; i++) {
  await channel.send(`${questions[i]}`);
  const filter = m => m.author.id === message.author.id;
  const collected = await channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
  const answer = collected.first().content;
  answers.push(answer);
    }

    // Monta o relatório com as respostas do usuário
    const report = `
    **Relatório presencial das ${answers[0]}**
    
    **Autor:** 
    _${answers[1]}_
    
    **HALL 1:** 
    _${answers[2]}_
    
    **HALL 2:**
    _${answers[3]}_
    
    **HALL 3:**
    _${answers[4]}_
    
    **HALL 4::**
    _${answers[5]}_
    
    **Comando Geral:**
    _${answers[6]}_
    
    **Comando Auxiliar:**
    _${answers[7]}_
    
    **Auxilio HALL 1:**
    _${answers[8]}_
    
    **Promocional ou Treinamento:**
    _${answers[9]}_
    
    **Ouvidoria:**
    _${answers[10]}_
    `;

    // Envia o relatório para um canal de logs
    const logsChannel = client.channels.cache.get('1096599193868574781'); // ID do canal de logs
    logsChannel.send(report);

    // Encerra o ticket e remove o canal
    channel.send('Relatório presencial postado. Seu ticket será fechado em breve.');
    setTimeout(() => {
      channel.delete();
    }, 30000);
  }
});

client.login('MTA2Nzk3NDk5NTk5MDU2MDc3OA.G3De_K.DwhFfc4QV-HSKW1Of5vzRLDNMjZFpXmTFTLm-c');

1007674123046096958-a93a8f32bd914ece0fb0af97c7a4771bb95384020414962c59f88ff344d60c87