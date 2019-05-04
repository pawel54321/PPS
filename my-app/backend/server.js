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

//tabele

pgClient
    .query('CREATE TABLE IF NOT EXISTS Uzytkownik (id SERIAL PRIMARY KEY, imie VARCHAR(255), nazwisko VARCHAR(255), login VARCHAR(255), haslo VARCHAR(255), prawa VARCHAR(255))')
    .catch((error) => {
        console.log(error);
    });

pgClient
    .query('CREATE TABLE IF NOT EXISTS Zaproszenia (id SERIAL PRIMARY KEY, id_grupa INT, id_uzytkownik INT, stan VARCHAR(255))')
    .catch((error) => {
        console.log(error);
    });


pgClient
    .query('CREATE TABLE IF NOT EXISTS Polubienia (id SERIAL PRIMARY KEY, liczba_polubien INT)')
    .catch((error) => {
        console.log(error);
    });


pgClient
    .query('CREATE TABLE IF NOT EXISTS Tabela_Posrednia (id SERIAL PRIMARY KEY, id_grupa INT, id_uzytkownik INT, moderator_grupy BOOLEAN)')
    .catch((error) => {
        console.log(error);
    });


pgClient
    .query('CREATE TABLE IF NOT EXISTS Post_Komentarz (id SERIAL PRIMARY KEY, id_grupa INT, id_uzytkownik INT, zawartosc VARCHAR(255), id_polubienia INT)')
    .catch((error) => {
        console.log(error);
    });

pgClient
    .query('CREATE TABLE IF NOT EXISTS Grupa_Pokoj (id SERIAL PRIMARY KEY, nazwa VARCHAR(255), opis VARCHAR(255))')
    .catch((error) => {
        console.log(error);
    });

//tabele



app.post('/Uzytkownik/Rejestracja', async (req, res) => {
    const imie = req.body.imie;
    const nazwisko = req.body.nazwisko;
    const login = req.body.login;
    const haslo = req.body.haslo;
    let prawa = 'Admin'; //'User' 'Admin'

    const czyjestjuzadmin = await pgClient.query("SELECT COUNT(login) FROM Uzytkownik")
    const tablicaczyjestjuzadmin = czyjestjuzadmin.rows;

    console.log(tablicaczyjestjuzadmin[0].count);

    if (tablicaczyjestjuzadmin[0].count > 0) {
        prawa = 'User';
    }

    const zapytanie = await pgClient.query("SELECT COUNT(login) FROM Uzytkownik WHERE login='" + login + "'")
    const tablica = zapytanie.rows;
    let czy_stworzono = false;

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

    let czy_poprawne = false;
    let prawaprawa = '';

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
    let u = {
        login: user.login,
        jaki_user: user.jaki_user
    };

    return token = jwt.sign(u, 'we5667cv8i099h9hGU^&rttf', {
        expiresIn: 60 * 60 * 24 // token wygaśnie po 24 godzinach
    });
}
//odczytanie tokenu
app.post('/ReadToken', function (req, res, next) {
    let token = req.body.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({message: 'Must pass token'});
    }

    jwt.verify(token, 'we5667cv8i099h9hGU^&rttf', function(err, user) {
        if (err) throw err;

        res.json({
            user: user,
            token: token
        });
    });
});


// NIE PRZETESTOWANE
app.post('/Grupa/Stworz', async (req, res) => {
    const nazwa = req.body.nazwa;
    const opis = req.body.opis;

    const id = req.body.id; // TOKEN/ID???

    const czyJestJuzNazwa = await pgClient.query("SELECT COUNT(nazwa) FROM Grupa_Pokoj");
    const tablicaCzyJestJuzNazwa = czyJestJuzNazwa.rows;

    console.log(tablicaCzyJestJuzNazwa[0].count);

    let czyStworzono = false;

    if (tablicaCzyJestJuzNazwa[0].count == 0)
    {
        pgClient.query('INSERT INTO Grupa_Pokoj(nazwa, opis) VALUES($1,$2)', [nazwa, opis])
            .catch((error) => {
                console.log(error);
            });

        const grupa = await pgClient.query("SELECT id FROM Grupa_Pokoj WHERE nazwa='" + nazwa + "'");

        console.log(grupa);

        pgClient.query('INSERT INTO Tabela_Posrednia(id_grupa, id_uzytkownik, moderator_grupy) VALUES($1,$2,$3)', [grupa, id, TRUE])
            .catch((error) => {
                console.log(error);
            });

        czyStworzono = true;
    }
    else
    {
        czyStworzono = false; // istnieje juz taka nazwa
    }

    res.send({
        nazwa: req.body.nazwa,
        opis: req.body.opis,
        id: req.body.id,

        zwracam_czy_stworzono: czyStworzono
    });
});
// NIE PRZETESTOWANE


app.post('/Grupa/Wyswietl', async (req, res) => {

    const zapytanie = await pgClient.query("SELECT * FROM Grupa_Pokoj");
    //console.log(zapytanie.rows);

    res.send({
        wyswietl: zapytanie.rows
    });
});


app.post('/Uzytkownik/Wyswietl', async (req, res) => {

    const zapytanie = await pgClient.query("SELECT * FROM Uzytkownik");
   // console.log(zapytanie.rows);

    res.send({
        wyswietl: zapytanie.rows //zapytanie.rows[0].id , zapytanie.rows[1].id
    });
});


