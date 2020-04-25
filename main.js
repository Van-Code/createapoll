const firebase = require('firebase');

const config = {
    apiKey: "YOUR_KEY",
    authDomain: "YOUR_AUTHDOMAIN",
    databaseURL: "YOUR_DB_URL",
    projectId: "YOUR_ID",
    storageBucket: "YOUR_BUCKET",
    messagingSenderId: "YOUR_SENDID",
    appId: "YOURAPPID",
    measurementId: "YOUR_MID"
};
firebase.initializeApp(config);

const port = process.env.PORT || 3000,
    express = require('express'),
    app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
// Set EJS as templating engine 
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { title: 'home' });
});

app.get('/create', (req, res) => {
    res.render('create', { error: '', title: 'create' });
});
app.post('/create', (req, res) => {
    const that = this;
    const newPostKey = firebase.database().ref().child('polls').push().key;
    this.newPoll = {
        question: req.body.question,
        choices: [
            { text: req.body.opt1, count: 0 },
            { text: req.body.opt2, count: 0 },
            { text: req.body.opt3, count: 0 },
            { text: req.body.opt4, count: 0 }
        ]
    }

    if (this.newPoll.question) {
        firebase.database()
            .ref('polls/' + newPostKey)
            .set(that.newPoll, function (error) {
                if (error) {
                    console.log(error)
                } else {
                    console.log('success')
                }
            })
        res.render('success', { newPostKey: newPostKey, title: 'create' });
    } else {
        res.render('create', { error: 'missing required fields', title: 'create' });
    }

});
app.get('/success', (req, res) => {
    res.render('success', { title: 'success' });
});
this.poll = {
    showResults: false,
    question: '',
    choices: [],
    id: '',
    error: ''
}
const that = this;
function getPoll(id) {
    ['question', 'choices'].forEach(key => {
        that.poll[key] = firebase.database().ref(`polls/${id}/${key}`);
        that.poll[key].on('value', function (snapshot) {
            that.poll[key] = snapshot.val()
        })
    })
}

app.get('/vote/:id', (req, res) => {
    const that = this;
    this.poll.id = req.params.id;
    getPoll(req.params.id)
    setTimeout(function () {
        res.render('vote', { poll: that.poll, title: 'vote' });
    }, 500)
});

app.post('/vote/:id', (req, res) => {
    const key = Object.keys(req.body)[0];
    if (this.poll.length > 0) {
        this.newVal = this.poll.choices[key].count + 1;
    }
    else {
        getPoll(req.params.id)
        this.newVal = this.poll.choices[key].count + 1;
    }
    if (req.body) {
        firebase.database()
            .ref('polls/' + this.poll.id + '/' + 'choices/' + key
                + '/count')
            .set(this.newVal, function (error) {
                if (error) {
                    console.log(error)
                } else {
                    console.log('success')
                }
            })
        req.body = undefined;
        this.poll.showResults = true;
    }
    res.render('vote', { poll: this.poll, title: 'vote' });
})
app.get('/catalog/', (req, res) => {
    let polls = firebase.database().ref('polls');
    polls.on('value', function (snapshot) {
        setTimeout(function () {
            res.render('catalog', { list: Object.entries(snapshot.val()), title: 'catalog' });
        }, 500)
    })
})

app.listen(port, () => {
    console.log(`server is running on port:  ${port}`)
})