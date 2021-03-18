var express = require('express');
var router = express.Router();
var curl = require('curlrequest');
var HTMLParser = require('node-html-parser');

router.post('/unread', (req, res) => {
    const { session } = req.body;
    
    if (!session) return;
    
    const cookie = `sessionid=${session}`;

    curl.request({ url: 'https://student.altstu.ru/message/unread', method: 'GET', include: true, cookie: cookie }, (err, parts) => {
        
        return res.send(parseMessages(parts))
    })
})

router.post('/archive', (req, res) => {
    const { session } = req.body; 
    
    const cookie = `sessionid=${session}`;

    curl.request({ url: 'https://student.altstu.ru/message/archive', method: 'GET', include: true, cookie: cookie }, (err, parts) => {
        
        return res.send(parseMessages(parts))
    })
})


function parseMessages(source) {
    const messagesHTML = HTMLParser.parse(source).querySelectorAll('.fi-msg-item');

        const messages = [];

        for (let messageHTML of messagesHTML) {
            const messageDetailsHTML = messageHTML.querySelector('.fi-msg-details');
            const messageDetails = {
                time: messageDetailsHTML.childNodes[0].innerText,
                sender: messageDetailsHTML.childNodes[1].innerText,
                receiver: messageDetailsHTML.childNodes[2].innerText
            }
            
            const messageDataHTML = messageHTML.querySelector('.panel-body');

            const messageData = [];
            for (const messageDataChildren of messageDataHTML.childNodes) {
                if (messageDataChildren.rawTagName === 'p') {
                    for (const childrenData of messageDataChildren.childNodes) {
                        if (childrenData.rawTagName === 'a')
                          messageData.push({tag: 'a', text: childrenData.innerText, link: childrenData.innerText})  
                        else
                        messageData.push({tag: childrenData.rawTagName ? childrenData.rawTagName : 'text', text: childrenData.innerText})
                    }
                }
            }

            messages.push({details: messageDetails, data: messageData});
        }
    
    return messages;
}

module.exports = router;