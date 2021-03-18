var express = require('express');
var router = express.Router();
var curl = require('curlrequest');

router.post('/', (req, res) => {
    const { login, password } = req.body;
    
    
    if (!login || !password) return res.status(400).send({error:'Неверные входные параметры'})

    auth(login, password,res);
})

async function auth(login, password, res) {
;

    return curl.request({ url: 'https://student.altstu.ru/login/', method: 'POST', data: {login, password}, include: true }, (err, parts) => {     
        const idx = parts.indexOf('sessionid=');

        const session = parts.slice(idx + 10, idx + 42);
        if (session[0] === '0')
            return res.status(418).send({error:'Данные для авторизации не верны'})
        
        return res.send({ session: parts.slice(idx + 10, idx + 42) })
    })

}

module.exports = router;