// app.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const k = require("./kaomoji");

const Kaomoji = k.Kaomoji;

const publicPath = path.resolve(__dirname, 'public');
const app = express();

app.set('view engine', 'hbs');

// middleware:
app.use(express.static(publicPath));
app.use(express.urlencoded({extended: false}));

/*
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    console.log(req.query);
    next();
})
*/

var emojis; // need to use var so it's global, eslint complained

// helper function to create arr of Kaomojis
function parseKaomojies (arr) {
    return arr.reduce((prev, curr) => {
        prev.push(new Kaomoji(curr.value, curr.emotions));
        return prev;
    }, []);
}

// read Kaomojis into 'emoji' array:
fs.readFile('code-samples/kaomojiData.json', 'utf-8', (err, data) => {
    if (!err) {
        emojis = parseKaomojies(JSON.parse(data));
        app.listen(3000, () => {
            console.log("Server started; type CTRL+C to shut down.");
        });
    }
});


app.get('/editor', (req, res) => {
    res.render('editor', {enteredInput: false});
});
app.get('/dictionary', (req, res) => {
    res.render('dictionary', {emojis: emojis});
});

app.get('/', (req, res) => {
    res.redirect('/editor');
});

app.post('/dictionary', (req, res) => {

    const emotions = req.body['emotions'].split(/,\s*/);

    // checks if anything was entered in value/emotions text boxes
    const checkEmpty = arr => {
        return arr.every(e => e !== '');
    };

    // if a new kaomoji was entered, push to 'emojis' array
    if ((req.body['value'] !== '') && (checkEmpty(emotions) === true)) {
        emojis.push(new Kaomoji(req.body['value'], emotions));
    }
    
    res.redirect('/dictionary');
});

app.post('/editor', (req, res) => {

    const input = req.body['input'].split(/\s+/);

    // utilizes Kaomoji method isEmotion to check if a given word can be 
    // replaced by a Kaomoji
    function isKaomoji (e) {
        for (let i = 0; i < emojis.length; i++) {
            if (emojis[i].isEmotion(e) === true) {
                return [true, emojis[i]["value"]];
            }
        } return [false];
    }

    // reduce -> start w/ empty string, concat each word from input
    // concat Kaomoji instead if it can replace a word
    const output = input.reduce((prev, curr) => {
        const temp = isKaomoji(curr);
        if (temp[0] === true) {
            prev += temp[1];
        } else { prev += curr; }
        return prev + " ";
    }, "");

    res.render('editor', {enteredInput: true, output: output});
});

// test for reading in Kaomoji data
//setTimeout(() => console.log(emojis), 2000);