var express = require('express');
var router = express.Router();
var curl = require('curlrequest');
var HTMLParser = require('node-html-parser');

router.post('/', (req, res) => {
    const { session } = req.body; 
    
    if (!session) return res.status(400).send({error:'Неверные входные параметры', code: 400})
    const cookie = `sessionid=${session}`;

    curl.request({ url: 'https://student.altstu.ru/', method: 'GET', include: true, cookie: cookie }, (err, parts) => {
        if (err) return res.status(500).send({ error: 'Внутренняя ошибка сервера, хост не доступен', code: 500 });
        
        return res.send(parseSchedule(parts))
    })
})


function parseSchedule(source) {
    const scheduleHTML = HTMLParser.parse(source).querySelector('.tab-content');

    const schedulesHTML = [scheduleHTML.childNodes[0], scheduleHTML.childNodes[1]];

    const schedule = [];

    for (const scheduleHTML of schedulesHTML) {
        const subjectsHTML = scheduleHTML.querySelectorAll('tr');

        const scheduleDay = [];

        for (const subjectHTML of subjectsHTML) {
            const subject = {
                name: subjectHTML.querySelector('strong').innerText.replace(/\s+/g, ' '),
                type: subjectHTML.querySelector('em').innerText.replace(/\s+/g, ' '),
                date: subjectHTML.childNodes[0].childNodes[0].innerText.replace(/\s+/g, ' '),
                place: subjectHTML.childNodes[1].childNodes[0].innerText.replace(/\s+/g, ''),
                teacher: subjectHTML.childNodes[1].childNodes[2].innerText.replace(/\s+/g, '' )
            }
            scheduleDay.push(subject);
        }

        schedule.push(scheduleDay);
    }
    
    return schedule;
}

module.exports = router;