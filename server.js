const http = require('http');
const mongoose = require('mongoose');

const { success, error } = require('./responseHandle.js');

const ArticleListModel = require('./models/ArticleList');

/** 載入 全域變數套件 */
const dotenv = require('dotenv');
// 全域變數套件設定
dotenv.config({ path: "./config.env" })


mongoose.connect('mongodb+srv://larry:<password>@cluster0.twdrv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => console.log('mongodb is connected...'));

async function requestListener(req, res) {

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });

    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Home Page</h1>');
        res.end();
    } else if (req.url === '/ArticleList' && req.method === 'GET') {
        const data = await ArticleListModel.find();
        success(res, data);
    } else if (req.url === '/ArticleList' && req.method === 'POST') {
        req.on('end', async () => {
            try {
                let { userName, userContent, userPhoto } = JSON.parse(body);
                let regex = /['\-<>]/g;

                userName = userName.trim();
                userContent = userContent.trim();
                userPhoto = userPhoto.trim();

                if (!userName) {
                    error(res, 'userName property is required');
                    return;
                }
                if (!userContent) {
                    error(res, 'userContent property is required');
                    return;
                }
                if (regex.test(userName) || regex.test(userContent) || regex.test(userPhoto)) {
                    error(res, "Do not use special symbol ( ' - < > )");
                    return;
                }

                const data = await ArticleListModel.create(
                    {
                        userName,
                        userContent,
                        userPhoto,
                    }
                );
                success(res, data);
            } catch (err) {
                error(res, err.message);
            }
        });
    } else if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h1>Not Found Page</h1>');
        res.end();
    }
}

const server = http.createServer(requestListener);

server.listen(process.env.PORT);  