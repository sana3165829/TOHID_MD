const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

// Font generator function with 10 different styles
const getRandomFont = (text) => {
    const fonts = [
        // 1. Small Caps
        (t) => t.toLowerCase().split('').map(c => c === ' ' ? ' ' : String.fromCharCode(c.charCodeAt(0) + 8271)).join(''),
        // 2. Bold Serif
        (t) => t.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 120734).join(''),
        // 3. Script Style
        (t) => t.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 119964).join(''),
        // 4. Monospace
        (t) => t.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 120365)).join(''),
        // 5. Double Struck
        (t) => t.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 120067)).join(''),
        // 6. Fraktur Bold
        (t) => t.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 120173).join(''),
        // 7. Sans Serif
        (t) => t.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 120302)).join(''),
        // 8. Circled
        (t) => t.split('').map(c => /[a-z]/i.test(c) ? String.fromCharCode(c.charCodeAt(0) + 9333 + (c.toLowerCase() === c ? 26 : 0)) : c).join(''),
        // 9. Parenthesized
        (t) => t.split('').map(c => /[a-z]/i.test(c) ? String.fromCharCode(c.charCodeAt(0) + 9372 + (c.toLowerCase() === c ? 26 : 0)) : c).join(''),
        // 10. Fullwidth
        (t) => t.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 65248)).join('')
    ];
    
    const fontIndex = Math.floor(Math.random() * fonts.length);
    return fonts[fontIndex](text);
};

// Function to get random image from 'tohid' folder
const getRandomImageFromFolder = () => {
    try {
        const folderPath = path.join(__dirname, '../tohid/img');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log('Created tohid folder as it didn\'t exist');
            return config.MENU_IMAGE_URL || 'https://i.ibb.co/4ZSYvPTq/lordali.jpg';
        }

        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(file => 
            ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase())
        );

        if (imageFiles.length === 0) {
            console.log('No images found in tohid folder, using default');
            return config.MENU_IMAGE_URL || 'https://i.ibb.co/4ZSYvPTq/lordali.jpg';
        }

        const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        return path.join(folderPath, randomImage);
    } catch (error) {
        console.error('Error accessing tohid folder:', error);
        return config.MENU_IMAGE_URL || 'https://i.ibb.co/4ZSYvPTq/lordali.jpg';
    }
};

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Count total commands
        const totalCommands = Object.keys(commands).length;
        
        // Apply random font to the menu title
        const menuTitle = getRandomFont(`${config.BOT_NAME} MENU`);
        
        const menuCaption = `╭━━━〔 *${menuTitle}* 〕━━━┈⊷
┃◈╭──❍「 *${getRandomFont("USER INFO")}* 」❍
┃◈├• 👑 ${getRandomFont("Owner")} : *${config.OWNER_NAME}*
┃◈├• 🤖 ${getRandomFont("Baileys")} : *Multi Device*
┃◈├• 🖥️ ${getRandomFont("Type")} : *NodeJs*
┃◈├• 🚀 ${getRandomFont("Platform")} : *Heroku*
┃◈├• ⚙️ ${getRandomFont("Mode")} : *[${config.MODE}]*
┃◈├• 🔣 ${getRandomFont("Prefix")} : *[${config.PREFIX}]*
┃◈├• 🏷️ ${getRandomFont("Version")} : *4.5.0 Bᴇᴛᴀ*
┃◈├• 📚 ${getRandomFont("Commands")} : *${totalCommands}*
┃◈╰─┬─★─☆──♪♪─❍
┃◈╭─┴❍「 *${getRandomFont("BOT STATUS")}* 」❍
┃◈├•➊  📥 *${getRandomFont("Download Menu")}*
┃◈├•➋  👥 *${getRandomFont("Group Menu")}*
┃◈├•➌  🤣 *${getRandomFont("Fun Menu")}*
┃◈├•➍  👑 *${getRandomFont("Owner Menu")}*
┃◈├•➎  🤖 *${getRandomFont("AI Menu")}*
┃◈├•➏  🎎 *${getRandomFont("Anime Menu")}*
┃◈├•➐  ♻️ *${getRandomFont("Convert Menu")}*
┃◈├•➑  📌 *${getRandomFont("Other Menu")}*
┃◈├•➒  💔 *${getRandomFont("Reactions Menu")}*
┃◈├•➊⓿ 🏫 *${getRandomFont("Main Menu")}*
┃◈╰─┬─★─☆──♪♪─❍
┃◈╭─┴────────────●●►
┃◈├ ╔═╦═╗───╔══╗╔╗╔╗╔╗
┃◈├ ║║║║╠╦╦═╩╗╔╩╣╚╬╬╝║
┃◈├ ║║║║║╔╩══╣║╬║║║║╬║
┃◈├ ╚╩═╩╩╝───╚╩═╩╩╩╩═╝
┃◈╰─┬────────────●●►
┃◈╭─┴────────────●●►
┃◈├•${getRandomFont("reply the number select")}
┃◈╰──────────────●●►
╰━━━〔 *${getRandomFont("FREE PALASTINE")}* 〕━━━┈⊷
> ${config.DESCRIPTION}`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363207624903731@newsletter',
                newsletterName: config.OWNER_NAME,
                serverMessageId: 143
            }
        };

        // Get random image from tohid folder
        const randomImagePath = getRandomImageFromFolder();

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                // Check if it's a local file or URL
                if (randomImagePath.startsWith('http')) {
                    return await conn.sendMessage(
                        from,
                        {
                            image: { url: randomImagePath },
                            caption: menuCaption,
                            contextInfo: contextInfo
                        },
                        { quoted: mek }
                    );
                } else {
                    return await conn.sendMessage(
                        from,
                        {
                            image: fs.readFileSync(randomImagePath),
                            caption: menuCaption,
                            contextInfo: contextInfo
                        },
                        { quoted: mek }
                    );
                }
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Send image with timeout
        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            sentMsg = await conn.sendMessage(
                from,
                { text: menuCaption, contextInfo: contextInfo },
                { quoted: mek }
            );
        }
        
        const messageID = sentMsg.key.id;

        // Complete menu data with all options
        const menuData = {
            '1': {
                title: getRandomFont("Download Menu"),
                content: `╭━━━〔 *${getRandomFont("Download Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ 🌐 *${getRandomFont("Social Media")}*
┃◈├• facebook [url]
┃◈├• mediafire [url]
┃◈├• tiktok [url]
┃◈├• twitter [url]
┃◈├• Insta [url]
┃◈├• apk [app]
┃◈├• img [query]
┃◈├• tt2 [url]
┃◈├• pins [url]
┃◈├• apk2 [app]
┃◈├• fb2 [url]
┃◈├• pinterest [url]
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 🎵 *${getRandomFont("Music/Video")}*
┃◈├• spotify [query]
┃◈├• play [song]
┃◈├• play2-10 [song]
┃◈├• audio [url]
┃◈├• video [url]
┃◈├• video2-10 [url]
┃◈├• ytmp3 [url]
┃◈├• ytmp4 [url]
┃◈├• song [name]
┃◈├• darama [name]
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            },
            '2': {
                title: getRandomFont("Group Menu"),
                content: `╭━━━〔 *${getRandomFont("Group Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ 🛠️ *${getRandomFont("Management")}*
┃◈├• grouplink
┃◈├• kickall
┃◈├• kickall2
┃◈├• kickall3
┃◈├• add @user
┃◈├• remove @user
┃◈├• kick @user
┃◈╰──────────────
┃◈╭──────────────
┃◈│ ⚡ *${getRandomFont("Admin Tools")}*
┃◈├• promote @user
┃◈├• demote @user
┃◈├• dismiss 
┃◈├• revoke
┃◈├• mute [time]
┃◈├• unmute
┃◈├• lockgc
┃◈├• unlockgc
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 🏷️ *${getRandomFont("Tagging")}*
┃◈├• tag @user
┃◈├• hidetag [msg]
┃◈├• tagall
┃◈├• tagadmins
┃◈├• invite
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            },
            '3': {
                title: getRandomFont("Fun Menu"),
                content: `╭━━━〔 *${getRandomFont("Fun Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ 🎭 *${getRandomFont("Interactive")}*
┃◈├• shapar
┃◈├• rate @user
┃◈├• insult @user
┃◈├• hack @user
┃◈├• ship @user1 @user2
┃◈├• character
┃◈├• pickup
┃◈├• joke
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 😂 *${getRandomFont("Reactions")}*
┃◈├• hrt
┃◈├• hpy
┃◈├• syd
┃◈├• anger
┃◈├• shy
┃◈├• kiss
┃◈├• mon
┃◈├• cunfuzed
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            },
            '4': {
                title: getRandomFont("Owner Menu"),
                content: `╭━━━〔 *${getRandomFont("Owner Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ ⚠️ *${getRandomFont("Restricted")}*
┃◈├• block @user
┃◈├• unblock @user
┃◈├• fullpp [img]
┃◈├• setpp [img]
┃◈├• restart
┃◈├• shutdown
┃◈├• updatecmd
┃◈╰──────────────
┃◈╭──────────────
┃◈│ ℹ️ *${getRandomFont("Info Tools")}*
┃◈├• gjid
┃◈├• jid @user
┃◈├• listcmd
┃◈├• allmenu
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            },
            '5': {
                title: getRandomFont("AI Menu"),
                content: `╭━━━〔 *${getRandomFont("AI Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ 💬 *${getRandomFont("Chat AI")}*
┃◈├• ai [query]
┃◈├• gpt3 [query]
┃◈├• gpt2 [query]
┃◈├• gptmini [query]
┃◈├• gpt [query]
┃◈├• meta [query]
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 🖼️ *${getRandomFont("Image AI")}*
┃◈├• imagine [text]
┃◈├• imagine2 [text]
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 🔍 *${getRandomFont("Specialized")}*
┃◈├• blackbox [query]
┃◈├• luma [query]
┃◈├• dj [query]
┃◈├• khan [query]
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            },
            '6': {
                title: getRandomFont("Anime Menu"),
                content: `╭━━━〔 *${getRandomFont("Anime Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ 🖼️ *${getRandomFont("Images")}*
┃◈├• fack
┃◈├• dog
┃◈├• awoo
┃◈├• garl
┃◈├• waifu
┃◈├• neko
┃◈├• megnumin
┃◈├• maid
┃◈├• loli
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 🎭 *${getRandomFont("Characters")}*
┃◈├• animegirl
┃◈├• animegirl1-5
┃◈├• anime1-5
┃◈├• foxgirl
┃◈├• naruto
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            },
            '7': {
                title: getRandomFont("Convert Menu"),
                content: `╭━━━〔 *${getRandomFont("Convert Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ 🖼️ *${getRandomFont("Media")}*
┃◈├• sticker [img]
┃◈├• sticker2 [img]
┃◈├• emojimix 😎+😂
┃◈├• take [name,text]
┃◈├• tomp3 [video]
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 📝 *${getRandomFont("Text")}*
┃◈├• fancy [text]
┃◈├• tts [text]
┃◈├• trt [text]
┃◈├• base64 [text]
┃◈├• unbase64 [text]
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            },
            '8': {
                title: getRandomFont("Other Menu"),
                content: `╭━━━〔 *${getRandomFont("Other Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ 🕒 *${getRandomFont("Utilities")}*
┃◈├• timenow
┃◈├• date
┃◈├• count [num]
┃◈├• calculate [expr]
┃◈├• countx
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 🎲 *${getRandomFont("Random")}*
┃◈├• flip
┃◈├• coinflip
┃◈├• rcolor
┃◈├• roll
┃◈├• fact
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 🔍 *${getRandomFont("Search")}*
┃◈├• define [word]
┃◈├• news [query]
┃◈├• movie [name]
┃◈├• weather [loc]
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            },
            '9': {
                title: getRandomFont("Reactions Menu"),
                content: `╭━━━〔 *${getRandomFont("Reactions Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ ❤️ *${getRandomFont("Affection")}*
┃◈├• cuddle @user
┃◈├• hug @user
┃◈├• kiss @user
┃◈├• lick @user
┃◈├• pat @user
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 😂 *${getRandomFont("Funny")}*
┃◈├• bully @user
┃◈├• bonk @user
┃◈├• yeet @user
┃◈├• slap @user
┃◈├• kill @user
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 😊 *${getRandomFont("Expressions")}*
┃◈├• blush @user
┃◈├• smile @user
┃◈├• happy @user
┃◈├• wink @user
┃◈├• poke @user
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            },
            '10': {
                title: getRandomFont("Main Menu"),
                content: `╭━━━〔 *${getRandomFont("Main Menu")}* 〕━━━┈⊷
┃◈╭──────────────
┃◈│ ℹ️ *${getRandomFont("Bot Info")}*
┃◈├• ping
┃◈├• live
┃◈├• alive
┃◈├• runtime
┃◈├• uptime
┃◈├• repo
┃◈├• owner
┃◈╰──────────────
┃◈╭──────────────
┃◈│ 🛠️ *${getRandomFont("Controls")}*
┃◈├• menu
┃◈├• menu2
┃◈├• restart
┃◈╰──────────────
╰━━━━━━━━━━━━━━━┈⊷
> ${config.DESCRIPTION}`,
                image: true,
                imagePath: getRandomImageFromFolder()
            }
        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                // Check if it's a local file or URL
                                if (selectedMenu.imagePath.startsWith('http')) {
                                    await conn.sendMessage(
                                        senderID,
                                        {
                                            image: { url: selectedMenu.imagePath },
                                            caption: selectedMenu.content,
                                            contextInfo: contextInfo
                                        },
                                        { quoted: receivedMsg }
                                    );
                                } else {
                                    await conn.sendMessage(
                                        senderID,
                                        {
                                            image: fs.readFileSync(selectedMenu.imagePath),
                                            caption: selectedMenu.content,
                                            contextInfo: contextInfo
                                        },
                                        { quoted: receivedMsg }
                                    );
                                }
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        const errorMsg = `❌ *${getRandomFont("Invalid Option")}!* ❌\n\n${getRandomFont("Please reply with a number between 1-10 to select a menu.")}\n\n*${getRandomFont("Example")}:* ${getRandomFont("Reply with")} "1" ${getRandomFont("for Download Menu")}\n\n> ${config.DESCRIPTION}`;
                        
                        await conn.sendMessage(
                            senderID,
                            {
                                text: errorMsg,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ ${getRandomFont("Menu system is currently busy. Please try again later.")}\n\n> ${config.DESCRIPTION}` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});