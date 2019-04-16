const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// express app setup
const appHandlers = [
    cors(),
    bodyParser.json()
];

const app = express();
app.use(appHandlers);

app.listen(5000, error => {
    console.log('Listening on port 5000');
});

//test
/*
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/value', async (req, res) => {
    res.send({
        value: 'Testowanie',
    });
});
*/
//test

// postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => {
    console.log('Lost PG connection');
});

pgClient
    .query('CREATE TABLE IF NOT EXISTS Uzytkownik (id SERIAL PRIMARY KEY, imie VARCHAR(255), nazwisko VARCHAR(255), login VARCHAR(255), haslo VARCHAR(255), prawa VARCHAR(255))')
    .catch((error) => {
        console.log(error);
    });


app.post('/Uzytkownik/Rejestracja', async (req, res) => {
    const imie = req.body.imie;
    const nazwisko = req.body.nazwisko;
    const login = req.body.login;
    const haslo = req.body.haslo;
    var prawa = 'Admin'; //'User' 'Admin'

    const czyjestjuzadmin = await pgClient.query("SELECT COUNT(login) FROM Uzytkownik")
    const tablicaczyjestjuzadmin = czyjestjuzadmin.rows;

    console.log(tablicaczyjestjuzadmin[0].count);

    if (tablicaczyjestjuzadmin[0].count > 0) {
        prawa = 'User';
    }

    const zapytanie = await pgClient.query("SELECT COUNT(login) FROM Uzytkownik WHERE login='" + login + "'")
    const tablica = zapytanie.rows;
    var czy_stworzono = false;

    if (tablica[0].count == 0) {
        pgClient.query('INSERT INTO Uzytkownik(imie, nazwisko, login, haslo, prawa) VALUES($1,$2,$3,$4,$5)', [imie, nazwisko, login, haslo, prawa])
            .catch((error) => {
                console.log(error);
            });
        czy_stworzono = true;
    } else {
        czy_stworzono = false;
    }

    res.send({
        imie: req.body.imie,
        nazwisko: req.body.nazwisko,
        login: req.body.login,
        haslo: req.body.haslo,

        zwracam_czy_stworzono: czy_stworzono
    });
});

app.post('/Uzytkownik/Logowanie', async (req, res) => {
    const login = req.body.login;
    const haslo = req.body.haslo;

    var czy_poprawne = false;
    var prawaprawa = '';

    const zapytanie2 = await pgClient.query("SELECT COUNT(*) FROM Uzytkownik WHERE login='" + login + "' AND haslo='" + haslo + "'")
        .catch((error) => {
            console.log(error);
        });

    const tablica = zapytanie2.rows;
    const prawa = await pgClient.query("SELECT prawa FROM Uzytkownik WHERE login='" + login + "'")
    const tablica2 = prawa.rows;

    if (tablica[0].count == 1) {
        czy_poprawne = true;
        prawaprawa = tablica2[0].prawa;
    } else
        czy_poprawne = false;

    const user = {
        login: login,
        jaki_user: prawaprawa
    };
    const token = generateToken(user);

    res.send({
        token: token,
        zwracam_czy_poprawne: czy_poprawne
    });
});



//generowanie tokenu
function generateToken(user) {
    var u = {
        login: user.login,
        jaki_user: user.jaki_user
    };

    return token = jwt.sign(u, 'we5667cv8i099h9hGU^&rttf', {
        expiresIn: 60 * 60 * 24 // token wygaśnie po 24 godzinach
    });
}
