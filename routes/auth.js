var express = require('express');
var router = express.Router();
var curl = require('curlrequest');

router.post('/', (req, res) => {
    const { login, password } = req.body;
    
    
    if (!login || !password) return;

    auth(login, password,res);
})

async function auth(login, password, res) {
;

    return curl.request({ url: 'https://student.altstu.ru/login/', method: 'POST', data: {login, password}, include: true }, (err, parts) => {     
        const idx = parts.indexOf('sessionid=');
        
        return res.send({ session: parts.slice(idx + 10, idx + 42) })
    })

}

module.exports = router;