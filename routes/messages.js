var express = require('express');
var router = express.Router();
var curl = require('curlrequest');
var HTMLParser = require('node-html-parser');
var checkStatus = require('../utils/checkStatus');

router.post('/unread', (req, res) => {
    const { session, page } = req.body;
    
    if (!session) return res.status(400).send({error:'Неверные входные параметры'})
    
    const cookie = `sessionid=${session}`;

    if (!page) {
        curl.request({ url: 'https://student.altstu.ru/message/unread', method: 'GET', include: true, cookie: cookie }, (err, parts) => {
            if (err) return res.status(500).send({ error: 'Внутренняя ошибка сервера, хост не доступен', code: 500 });
            if (!checkStatus(parts)) return res.status(301).send({ error: 'Невалидная сессия', code: 301 });

            return res.send(parseMessages(parts))
        })
    }
    else {
         curl.request({ url: `https://student.altstu.ru/message/unread?p=${page}`, method: 'GET', include: true, cookie: cookie }, (err, parts) => {
            if (err) return res.status(500).send({ error: 'Внутренняя ошибка сервера, хост не доступен', code: 500 });
            if (!checkStatus(parts)) return res.status(301).send({ error: 'Невалидная сессия', code: 301 });
             
            return res.send(parseMessages(parts))
        })
    }
})

router.post('/archive', (req, res) => {
    const { session, page } = req.body; 
    
    if (!session) return res.status(400).send({error:'Неверные входные параметры'})

    const cookie = `sessionid=${session}`;
    if (!page) {
        curl.request({ url: 'https://student.altstu.ru/message/archive', method: 'GET', include: true, cookie: cookie }, (err, parts) => {
            if (err) return res.status(500).send({ error: 'Внутренняя ошибка сервера, хост не доступен', code: 500 });
            if (!checkStatus(parts)) return res.status(301).send({ error: 'Невалидная сессия', code: 301 });

            return res.send(parseMessages(parts))
        })
    }
    else {
        curl.request({ url: `https://student.altstu.ru/message/archive/?p=${page}`, method: 'GET', include: true, cookie: cookie }, (err, parts) => {
            if (err) return res.status(500).send({ error: 'Внутренняя ошибка сервера, хост не доступен', code: 500 });
            if (!checkStatus(parts)) return res.status(301).send({ error: 'Невалидная сессия', code: 301 });
            
            return res.send(parseMessages(parts))
    })
    }
        
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