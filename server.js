var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/mongo_DDB', { useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var QuoteSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2 },
    message: { type: String, required: true, minlength: 2 }
}, { timestamps: true })
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

app.get('/', function (req, res) {
    res.render('index');
})

app.post('/add', function (req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote({ name: req.body.name, message: req.body.message });
    quote.save(function (err) {
        if (err) {
            console.log('Something went wrong');
            console.log(quote.errors);
            res.render('index', { errors: quote.errors })
        }
        else {
            console.log('Successfully added a quote!');
            res.redirect('/quotes');
        }
    })
})

app.get('/quotes', function (req, res) {
    arr = Quote.find({}, function (err, quotes) {
        res.render('quotes', { arr: quotes });
    })
})

app.listen(6262, function () {
    console.log("Listening on port 6262");
})