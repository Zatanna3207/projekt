//zmienne, stałe
var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;
var path = require("path")
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
let users = [
    { id: "1", nick: "111", password: "111", age: "15", student: "on", plec: "k" },
    { id: "2", nick: "222", password: "222", age: "17", student: "off", plec: "m" },
    { id: "3", nick: "333", password: "333", age: "12", student: "on", plec: "m" },
    { id: "4", nick: "Jacek", password: "Jacek123", age: "18", student: "off", plec: "m" },
    { id: "5", nick: "Ola", password: "Ola123", age: "10", student: "on", plec: "k" }
]
let logged = false
const strona_ogol = "<body style='background-color:darkcyan;width:100%;height:100%'><a style='color:white;margin:10px;font-size:large;' href='/sort'>Sort</a><a  style='color:white;margin:10px;font-size:large;' href='gender'>Gender</a><a  style='color:white;margin:10px;font-size:large;'href='show'>Show</a>"
sortowanko = true


//nasłuch na określonym porcie
app.listen(PORT, function () {
    console.log("start serwara na porcie " + PORT)
})


//funkcje na serwerze, obsługujące konkretne adresy w przegladarcze:
//main
app.get("/", function (req, res) {
    console.log("obsluga adresu /")
    res.sendFile(path.join(__dirname + '/static/main.html'))
})
app.get("/main", function (req, res) {
    console.log("obsluga adresu /main")
    res.sendFile(path.join(__dirname + '/static/main.html'))
})

//register
app.get("/register", function (req, res) {
    console.log("obsluga adresu /register")
    res.sendFile(path.join(__dirname + '/static/register.html'))
    console.log()
})
app.post("/register_form", function (req, res) {
    if (users.findIndex(array => array.nick === req.body.nick) == "-1" && req.body.nick != '') {
        users.push(req.body)
        users[users.length - 1].id = users.length
        res.send("<h1>Rejsetracja powiodła się</h1><a href='/'>Powrót do Main</a>")
    } else
        res.send("<h1>Podany login jest już używany lub podałeś/aś błędne dane</h1><a href='/'>Powrót do Main</a>")
})

//login
app.get("/login", function (req, res) {
    console.log("obsluga adresu /login")
    res.sendFile(path.join(__dirname + '/static/login.html'))
})
app.post("/login_form", function (req, res) {
    let logowanie = users.findIndex(array => array.nick === req.body.nick)
    if (logowanie != '-1' && req.body.password === users[logowanie].password) {
        logged = true;
        res.redirect('/admin');
    } else {
        res.send("<h1>Niepoprwany login lub hasło</h1><a href='/'>Powrót do Main</a>")
    }
})
app.get("/log_out", function (req, res) {
    if (!logged)
        res.sendFile(path.join(__dirname + "podana strona nie istnieje"))
    logged = false;
    res.redirect('/')
})

//admin
app.get("/admin", function (req, res) {
    console.log("obsluga adresu /adminnode")
    if (logged)
        res.sendFile(path.join(__dirname + "/static/admin_logged.html"))
    else
        res.sendFile(path.join(__dirname + "/static/admin.html"))
})

//show
app.get('/show', function (req, res) {
    if (logged) {
        users = users.sort(function (a, b) {
            return parseFloat(a.id) - parseFloat(b.id);
        });;
        let stronka = strona_ogol + "<table style='width:80%; height:60%'>"
        for (i = 0; i < users.length; i++) {
            stronka += tabelka_show(users, i)
        }
        stronka += "</table></body>"
        res.send(stronka)
    } else
        res.sendFile(path.join(__dirname + "/static/admin.html"))
})
function tabelka_show(tablica, i) {
    let komurki = ''
    komurki += "<tr style='background-color:darkcyan;color:white;border:solid 1px white' ><th style='background-color:darkcyan;color:white;border:solid 1px white'> id :  " + tablica[i].id + "</th><th style='background-color:darkcyan;color:white; border:solid 1px white'> user:  " + tablica[i].nick + " - " + tablica[i].password + "</th>"
    if (tablica[i].student == "on")
        komurki += "<th style='background-color:darkcyan;color:white; border:solid 1px white'>Uczeń : <input type='checkbox' checked disabled></th>"
    else
        komurki += "<th style='background-color:darkcyan;color:white; border:solid 1px white'>Uczeń : <input type='checkbox' disabled></th>"
    komurki += "<th style='background-color:darkcyan;color:white; border:solid 1px white'> Wiek: " + tablica[i].age + "</th>" + "<th style='background-color:darkcyan;color:white; border:solid 1px white'> płeć: " + tablica[i].plec + "</th></tr>"
    return komurki
}

//gender
app.get('/gender', function (req, res) {
    if (logged) {
        let stronka = strona_ogol + "<table style='margin:0 auto;width:80%;height:30%' >"
        let tabelka = "<table style='margin:0 auto;width:80%;height:30%;margin-top:10px;' >"
        for (i = 0; i < users.length; i++) { // tworzę stringa z tabelą
            if (users[i].plec == "m")
                tabelka += tabelka_gender(users, i)
            else
                stronka += tabelka_gender(users, i)
        }
        stronka += "</table>" + tabelka + "</table></body>"
        res.send(stronka)
    } else
        res.sendFile(path.join(__dirname + "/static/admin.html"))
})
function tabelka_gender(tablica, i) {
    let komurki = ''
    komurki += "<tr style='background-color:darkcyan;color:white;border:solid 1px white' ><th style='background-color:darkcyan;color:white;border:solid 1px white'> id: " + tablica[i].id + "</th>"
    komurki += "<th style='background-color:darkcyan;color:white; border:solid 1px white'> płeć: " + tablica[i].plec + "</th></tr>"
    return komurki
}

//sort
app.get('/sort', function (req, res) {
    if (logged) {
        let users_tab = users;
        users_tab = users_tab.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        });;
        let stronka = strona_ogol
        if (sortowanko)
            stronka += "<form  onchange='this.submit()'  method='POST' action='/sort'><input checked type='radio' name='type' id='r1'value='up' ><label style='color:white'for='#r1'>Rosnąco</label> <input type='radio' name='type' id='r2'value='dwn'><label style='color:white' for='#r2'>Malejąco</label></form><table style='margin:0 auto;width:80vw;height:30vh ' >"
        else {
            stronka += "<form  onchange='this.submit()'  method='POST' action='/sort'><input type='radio' name='type' id='r1'value='up' ><label style='color:white'for='#r1'>Rosnąco</label> <input type='radio' checked name='type' id='r2'value='dwn'><label style='color:white' for='#r2'>Malejąco</label></form><table style='margin:0 auto;width:80vw;height:30vh ' >"
            users_tab.reverse()
        }
        let tabelka = "<table style='margin:0 auto;width:80%;height:30%;margin-top:10px;' >"
        for (i = 0; i < users.length; i++) { // tworzę stringa z tabelą
            if (sortowanko)
                tabelka += tabelka_sort(users_tab, i)
            else
                stronka += tabelka_sort(users_tab, i)
        }
        stronka += "</table>" + tabelka + "</table></body>"
        res.send(stronka)
    } else
        res.sendFile(path.join(__dirname + "/static/admin.html"))
})
function tabelka_sort(tablica, i) {
    let komurki = ''
    komurki += "<tr style='background-color:darkcyan;color:white;border:solid 1px white' ><th style='background-color:darkcyan;color:white;border:solid 1px white'> id :  " + tablica[i].id + "</th><th style='background-color:darkcyan;color:white; border:solid 1px white'> user:  " + tablica[i].nick + " - " + tablica[i].password + "</th>"
    komurki += "<th style='background-color:darkcyan;color:white; border:solid 1px white'> Wiek: " + tablica[i].age + "</th></tr>"
    return komurki
}
app.post('/sort', function (req, res) {
    if (req.body.type == 'dwn')
        sortowanko = false
    else
        sortowanko = true
    res.redirect("/sort")
})