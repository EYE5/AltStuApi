var express = require('express');
var router = express.Router();
var curl = require('curlrequest');
var HTMLParser = require('node-html-parser');

router.post('/', (req, res) => {
    const { session } = req.body; 
    
    const cookie = `sessionid=${session}`;

    curl.request({ url: 'https://student.altstu.ru/files/active/', method: 'GET', include: true, cookie: cookie }, (err, parts) => {
        
        return res.send(parseFiles(parts))
    })
})


function parseFiles(source) {
    const filesHTML = HTMLParser.parse(source).querySelectorAll('.fi-msg-item');

    const files = [];

        for (let fileHTML of filesHTML) {
            const fileDetailsHTML = fileHTML.querySelector('.fi-msg-details');

            if (!fileDetailsHTML.childNodes[0] || !fileDetailsHTML.childNodes[1] || !fileDetailsHTML.childNodes[2]) continue;
            const fileDetails = {
                time: fileDetailsHTML.childNodes[0].innerText,
                sender: fileDetailsHTML.childNodes[1].innerText,
                receiver: fileDetailsHTML.childNodes[2].innerText
            }
            
            const fileDataHTML = fileHTML.querySelector('.panel-body');

            const fileData = [];
            for (const fileDataChildren of fileDataHTML.childNodes) {
                if (fileDataChildren.rawTagName === 'p') {
                    for (const childrenData of fileDataChildren.childNodes) {
                        if (childrenData.rawTagName === 'a')
                          fileData.push({tag: 'a', text: childrenData.innerText, link: childrenData.innerText})  
                        else
                        fileData.push({tag: childrenData.rawTagName ? childrenData.rawTagName : 'text', text: childrenData.innerText})
                    }
                }
            }

            const fileLink = fileHTML.querySelector('.fi-file-actions').childNodes[0];

            files.push({details: fileDetails, data: fileData, link:fileLink.attrs.href});
        }
    
    return files;
}

module.exports = router;