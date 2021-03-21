var express = require('express');
var router = express.Router();
var curl = require('curlrequest');

router.post('/', (req, res) => {
    const { login, password } = req.body;
    
    
    if (!login || !password) return res.status(400).send({error:'Неверные входные параметры', code: 400})

    auth(login, password,res);
})

async function auth(login, password, res) {
;

    return curl.request({ url: 'https://student.altstu.ru/login/', method: 'POST', data: { login, password }, include: true }, (err, parts) => {
        if (err) return res.status(500).send({ error: 'Внутренняя ошибка сервера, хост не доступен', code: 500 });
        
        const idx = parts.indexOf('sessionid=');

        const session = parts.slice(idx + 10, idx + 42);
        if (session[0] === '0')
            return res.status(401).send({error:'Данные авторизации не верны', code: 401})
        
        return res.send({ session: parts.slice(idx + 10, idx + 42) })
    })

}

module.exports = router;