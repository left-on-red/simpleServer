let fs = require('fs');
let http = require('http');
let https = require('https');
let moment = require('moment');
let express = require('express');
let app = express();

let secured = false;

app.get('/*', function(request, response) {
    let path = `F:/${unescape(request.params[0])}`;
    if (fs.existsSync(path)) {
        let back = request.params[0].split('/');
        back.pop();
        back = back.join('/');
        if (fs.statSync(path).isDirectory()) {
            let contents = fs.readdirSync(path);
            let list = [];
            if (request.params[0] != '') { request.params[0] = `/${request.params[0]}` }
            for (let c = 0; c < contents.length; c++) {
                //let character = '🗎';
                //if (fs.statSync(`${path}/${contents[c]}`).isDirectory()) { character = '🗁' }
                list.push(`<li><a href="${request.params[0]}/${contents[c]}"><i class="character">${/*character*/''}</i> ${contents[c]}</a></li>`)
            }

            let backElem = '';
            if (request.params[0] != '') { backElem = `<li><a href="/${back}">.. (back)</a></li>` }

            response.send(`
            <style>
                * {
                    font-family: monospace;
                    color: black;
                    font-size: 24px;
                }

                div {
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    margin-bottom: 50px;
                }

                ul {
                    list-style: none;
                    width: 40%;
                    display: inline-block;
                    text-align: left;
                }

                ul li {
                    margin: 0;
                    padding: 0;
                }

                a {
                    padding: 15px 0px 15px 15px;
                    display: inline-block;
                    text-decoration: none;
                    width: 100%;
                }

                a:visited {
                    color: inherit;
                }

                ul li:nth-child(even) a {
                    background-color: rgba(0, 0, 0, 0.05);
                }

                ul li:nth-child(odd) a {
                    background-color: rgba(0, 0, 0, 0.08);
                }

                i.character {
                    font-size: 24px;
                    font-style: normal;
                }
            </style>
            <div><ul>${backElem}${list.join('')}</ul></div>
            `);
        }

        else {
            console.log(`${moment().format('MM/DD/YYYY @ hh:mm:ssA')} : ${path} : ${request.ip}`);
            response.sendFile(path);
        }
    }

    else { response.send('<pre>404 Not Found!</pre>') }
});

if (secured) {
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.crt')
    }, app).listen(443, function() { console.log(`secure server hosted at https://localhost:443`) });
}

else {
    http.createServer(app).listen(80, function() { console.log(`insecure server hosted at http://localhost:80`) });
}