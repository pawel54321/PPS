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

//TABELE

pgClient
    .query('CREATE TABLE IF NOT EXISTS Polubienia (id SERIAL PRIMARY KEY, liczba_polubien INT)')
    .catch((error) => {
        console.log("Polubienia" + error);
    });


pgClient
    .query('CREATE TABLE IF NOT EXISTS Grupa_Pokoj (id SERIAL PRIMARY KEY, nazwa VARCHAR(255), opis VARCHAR(255), flaga BOOLEAN DEFAULT true)')
    .catch((error) => {
        console.log("Grupa_Pokoj"+error);
    });

pgClient
    .query('CREATE TABLE IF NOT EXISTS Uzytkownik (id SERIAL PRIMARY KEY, imie VARCHAR(255), nazwisko VARCHAR(255), login VARCHAR(255), haslo VARCHAR(255), prawa VARCHAR(255), flaga BOOLEAN DEFAULT true)')
    .catch((error) => {
        console.log("Uzytkownik" + error);
    });

//REFERENCES
pgClient
    .query('CREATE TABLE IF NOT EXISTS Post_Komentarz (id SERIAL PRIMARY KEY, id_grupa INT REFERENCES Grupa_Pokoj (id), id_uzytkownik INT REFERENCES Uzytkownik (id), zawartosc VARCHAR(255), id_polubienia INT REFERENCES Polubienia (id), data DATE)')
    .catch((error) => {
        console.log("Post_Komentarz" + error);
    });

pgClient
    .query('CREATE TABLE IF NOT EXISTS Zaproszenia (id SERIAL PRIMARY KEY, id_grupa INT REFERENCES Grupa_Pokoj (id), id_uzytkownik INT REFERENCES Uzytkownik (id), stan VARCHAR(255))')
    .catch((error) => {
        console.log("Zaproszenia" + error);
    });


pgClient
    .query('CREATE TABLE IF NOT EXISTS Tabela_Posrednia (id SERIAL PRIMARY KEY, id_grupa INT REFERENCES Grupa_Pokoj (id), id_uzytkownik INT REFERENCES Uzytkownik (id), moderator_grupy BOOLEAN)')
    .catch((error) => {
        console.log("Tabela_Posrednia" + error);
    });
//REFERENCES

//TABELE

app.post('/Uzytkownik/Rejestracja', async (req, res) => {
    const imie = req.body.imie;
    const nazwisko = req.body.nazwisko;
    const login = req.body.login;
    const haslo = req.body.haslo;
    let prawa = 'Admin'; //'User' 'Admin'

    const czyjestjuzadmin = await pgClient.query("SELECT COUNT(login) FROM Uzytkownik")
    const tablicaczyjestjuzadmin = czyjestjuzadmin.rows;

   // console.log(tablicaczyjestjuzadmin[0].count);

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
    let id = '';

    const zapytanie2 = await pgClient.query("SELECT COUNT(*) FROM Uzytkownik WHERE login='" + login + "' AND haslo='" + haslo + "' AND flaga=true")
        .catch((error) => {
            console.log(error);
        });

    const tablica = zapytanie2.rows;
    const prawa = await pgClient.query("SELECT id, prawa FROM Uzytkownik WHERE login='" + login + "'")
    const tablica2 = prawa.rows;

    if (tablica[0].count == 1) {
        czy_poprawne = true;
        prawaprawa = tablica2[0].prawa;
        id = tablica2[0].id;
    } else
        czy_poprawne = false;

    const user = {
        id: id,
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
        id: user.id,
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
  //  console.log(token);
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

//----------------
// FUNKCJONALNOSCI:
//----------------

//GOTOWE [/Grupa/Stworz + /Grupa/Stworz_Moderatora = RAZEM] [(user/admin/moderator)]
app.post('/Grupa/Stworz', async (req, res) => {
    const nazwa = req.body.nazwa;
    const opis = req.body.opis;

    const czyJestJuzNazwa = await pgClient.query("SELECT COUNT(nazwa) FROM Grupa_Pokoj WHERE nazwa='"+nazwa+"'");
    const tablicaCzyJestJuzNazwa = czyJestJuzNazwa.rows;

    //console.log(tablicaCzyJestJuzNazwa[0].count);

    let czyStworzono = false;

    if (tablicaCzyJestJuzNazwa[0].count == 0)
    {
        pgClient.query('INSERT INTO Grupa_Pokoj(nazwa, opis) VALUES($1,$2)', [nazwa, opis])
            .catch((error) => {
                console.log(error);
            });

            czyStworzono = true;
      //  }
    }
    else
    {
        czyStworzono = false; // istnieje juz taka nazwa
    }

    res.send({
        nazwa: req.body.nazwa,
        opis: req.body.opis,

        zwracam_czy_stworzono: czyStworzono
    });
});
//GOTOWE [/Grupa/Stworz + /Grupa/Stworz_Moderatora = RAZEM] [(user/admin/moderator)]

//GOTOWE [/Grupa/Stworz + /Grupa/Stworz_Moderatora = RAZEM] [(user/admin/moderator)]
app.post('/Grupa/Stworz_Moderatora_Z_Dolaczeniem_Do_Grupy_Lub_Uzytkownika_Z_Dolaczeniem_Do_Grupy', async (req, res) => {

    const coZrobic = req.body.coZrobic; // TRUE - MODERATOR / FALSE - UŻYTKOWNIK

    const nazwa = req.body.nazwa;
    const id_uzytkownik = req.body.id; // TOKEN/(ID)???
   // const id_uzytkownik = 1; // TOKEN/(ID)???

    console.log(nazwa);
    console.log(id_uzytkownik);

    let czyStworzono = false;
    const czyJestJuzNazwa = await pgClient.query("SELECT COUNT(nazwa) FROM Grupa_Pokoj WHERE nazwa='" + nazwa + "'");
    const tablicaCzyJestJuzNazwa = czyJestJuzNazwa.rows;
    if (tablicaCzyJestJuzNazwa[0].count == 1) {


        const grupa = await pgClient.query("SELECT id FROM Grupa_Pokoj WHERE nazwa='" + nazwa + "'");
        const tablicaGrupa = grupa.rows;

        //let id_grupy;

        //  if (Object.keys(tablicaGrupa).length != 0) {

        console.log("tab" + tablicaGrupa[0].id);
        const id_grupy = tablicaGrupa[0].id;
        console.log("id_grupa" + id_grupy);
        // }
        // else {
        // id_grupy = 1;
        //  }
        const czyJestJuzTaki = await pgClient.query("SELECT COUNT(moderator_grupy) FROM Tabela_Posrednia WHERE id_grupa='" + id_grupy + "' AND id_uzytkownik='" + id_uzytkownik +"' AND moderator_grupy='"+true+"'");
        const tablicaczyJestJuzTaki = czyJestJuzTaki.rows;

        if (tablicaczyJestJuzTaki[0].count == 0) {
            pgClient.query('INSERT INTO Tabela_Posrednia(id_grupa, id_uzytkownik, moderator_grupy) VALUES($1,$2,$3)', [id_grupy, id_uzytkownik, coZrobic])
                .catch((error) => {
                    console.log(error);
                    czyStworzono = false;
                });

            czyStworzono = true;
        }
    }
    else {
        czyStworzono = false;
    }
    res.send({
        nazwa: req.body.nazwa,
        id_uzytkownik: req.body.id,
        coZrobic: req.body.coZrobic,
        //  id_uzytkownik: req.body.id_uzytkownik,

        zwracam_czy_stworzono: czyStworzono
    });
});
//GOTOWE [/Grupa/Stworz + /Grupa/Stworz_Moderatora = RAZEM] [(user/admin/moderator)]

//GOTOWE [(admin)]
app.post('/Grupa/Zablokuj_Grupe', async (req, res) => {

    //const id_uzytkownik = 1; // TOKEN/(ID)???
    const nazwa = req.body.nazwa;

    let czyZablokowano = true;

    pgClient.query("UPDATE Grupa_Pokoj SET flaga=false WHERE nazwa='" + nazwa+"'")
        .catch((error) => {
            console.log(error);
            czyZablokowano = false;
        });


    res.send({
        nazwa: req.body.nazwa,

        zwracam_czy_zablokowano: czyZablokowano
    });
});
//GOTOWE [(admin)]

//GOTOWE[(user/admin/moderator)]
app.post('/Grupa/Czy_Nazwa_Jest_W_Bazie_Danych', async (req, res) => {

    const nazwa = req.body.nazwa;

    let czyJest = false;

    const czyJestJuzNazwa = await pgClient.query("SELECT COUNT(nazwa) FROM Grupa_Pokoj WHERE nazwa='" + nazwa + "'");

    const tablicaCzyJestJuzNazwa = czyJestJuzNazwa.rows;

    if (tablicaCzyJestJuzNazwa[0].count == 1) {
        czyJest = true;
    }
    else {
        czyJest = false;
    }

    res.send({
        nazwa: req.body.nazwa,

        zwracam_czy_jest: czyJest
    });
});
//GOTOWE [(user/admin/moderator)]

//GOTOWE [(admin)]
app.post('/Grupa/Wyswietl', async (req, res) => {

    const zapytanie = await pgClient.query("SELECT * FROM Grupa_Pokoj WHERE flaga=true");
    //console.log(zapytanie.rows);

    res.send({
        wyswietl: zapytanie.rows
    });
});
//GOTOWE [(admin)]

//GOTOWE [(user/moderator)] wyswietla grupy gdzie jestem modem powinno byc DanyLogin/Grupy
app.post('/Grupa/Wyswietl/DanyLogin', async (req, res) => {

    const id = req.body.id;
    const zapytanie = await pgClient.query("SELECT gr.id, gr.nazwa, gr.opis FROM Grupa_Pokoj as gr, tabela_posrednia as ta, uzytkownik as uz WHERE uz.id = ta.id_uzytkownik AND ta.id_grupa = gr.id AND ta.moderator_grupy=true AND uz.id ='" + id +"' AND gr.flaga=true");
    //console.log(zapytanie.rows);

    res.send({
        id: req.body.id,

        wyswietl: zapytanie.rows
    });
});
//GOTOWE [(user/moderator)] wyswietla grupy gdzie jestem modem powinno byc DanyLogin/Grupy

//...

//GOTOWE [(user/moderator)] wyswietla uzytkownikow z grupy gdzie jestem modem
app.post('/Grupa/Wyswietl/DanyLogin/Uzytkownicy', async (req, res) => {

    const nazwaGrupy = req.body.nazwaGrupy;
    const zapytanie = await pgClient.query("SELECT uz.id, uz.login, uz.imie, uz.nazwisko FROM Grupa_Pokoj as gr, tabela_posrednia as ta, uzytkownik as uz WHERE uz.id = ta.id_uzytkownik AND ta.id_grupa = gr.id AND ta.moderator_grupy=false AND gr.nazwa='" + nazwaGrupy + "' AND gr.flaga=true");
    //console.log(zapytanie.rows);

    res.send({
        id: req.body.id,

        wyswietl: zapytanie.rows
    });
});
//GOTOWE [(user/moderator)] wyswietla uzytkownikow z grupy gdzie jestem modem

//...

//DODAC id_uzytkownik - DOPISAC domyslnie dalem 1 + DODAC id_grupa - DOPISAC domyslnie dalem 1 + POPRAWIC KOMUNIKAT BO DLA KLKNIECIA MODERATORA WYSWIETLI SIE OK A NIE USUNIE [(moderator)]
app.post('/Grupa/Zablokuj_Uzytkownika_Z_Mojej_Grupy', async (req, res) => {

    const id_uzytkownik = req.body.id;
    const nazwaGrupy = req.body.nazwaGrupy;

    let czyZablokowano = true;

    const zapytanie = await pgClient.query("SELECT id FROM grupa_pokoj WHERE nazwa='" + nazwaGrupy + "'")
        .catch((error) => {
            console.log(error);
        });
        console.log(zapytanie.rows);

    const idGrupy = zapytanie.rows[0].id;

    //  pgClient.query("UPDATE Grupa_Pokoj SET flaga='false' WHERE id='" + id_grupa)
    //     .catch((error) => {
    //        console.log(error);
    //        czyZablokowano = false;
    //    });

    pgClient.query("DELETE FROM tabela_posrednia WHERE id_uzytkownik='" + id_uzytkownik + "' AND id_grupa='" + idGrupy + "'")
        .catch((error) => {
            console.log(error);
            czyZablokowano = false;
        });

     res.send({
        id_uzytkownik: req.body.id_uzytkownik,
        zwracam_czy_zablokowano: czyZablokowano
     });
});
//DODAC id_uzytkownik - DOPISAC domyslnie dalem 1 + DODAC id_grupa - DOPISAC domyslnie dalem 1 + POPRAWIC KOMUNIKAT BO DLA KLKNIECIA MODERATORA WYSWIETLI SIE OK A NIE USUNIE [(moderator)]

//...


// ------------------------------------------------------

//GOTOWE [(admin)]
app.post('/Uzytkownik/Wyswietl', async (req, res) => {

    const zapytanie = await pgClient.query("SELECT * FROM Uzytkownik WHERE prawa<>'Admin' AND flaga=true");
   // console.log(zapytanie.rows);

    res.send({
        wyswietl: zapytanie.rows //zapytanie.rows[0].id , zapytanie.rows[1].id
    });
});
//GOTOWE [(admin)]

//GOTOWE [(user/admin/moderator)]
app.post('/Uzytkownik/Wyswietl/DanyLogin', async (req, res) => {

    const login = req.body.login;
 //   const login = 'admin' // TOKEN/ID/(NAZWA)???

    const zapytanie = await pgClient.query("SELECT * FROM Uzytkownik WHERE login='"+login+"'");
    // console.log(zapytanie.rows);

    res.send({
        login: req.body.login,
        wyswietl: zapytanie.rows //zapytanie.rows[0].id , zapytanie.rows[1].id
    });
});
//GOTOWE [(user/admin/moderator)]

//GOTOWE - [(user/admin/moderator)]
app.post('/Uzytkownik/Zaaktulizuj/DanyLogin', async (req, res) => {

    const id = req.body.id;
    //const login = 'admin' // TOKEN/ID/(NAZWA)???

    const imie = req.body.imie;
    const nazwisko = req.body.nazwisko;
   // const haslo = req.body.haslo;
    let czyZaktualizowano = true;

    pgClient
        .query("UPDATE Uzytkownik SET imie='"+imie+"', nazwisko='"+nazwisko+"' WHERE id='" + id + "'")
        .catch((error) => {
            console.log(error);
            czyZaktualizowano = false;
        });
     // .query("UPDATE Uzytkownik SET imie='"+imie+"', nazwisko='"+nazwisko+"', haslo='"+haslo+"' WHERE id='" + id + "'")
    res.send({
        id: req.body.id,
        imie: req.body.imie,
        nazwisko: req.body.nazwisko,
      //  haslo: req.body.haslo,

        zwracam_czy_zaktualizowano: czyZaktualizowano
    });
});
//GOTOWE - [(user/admin/moderator)]


//GOTOWE [(admin)] + DODAC ASPEKTY JESLI ZABLOKUJE MODERATORA GRUPY MOZLIWOSC PRZEKAZANIA PRAW INNEMU UZYTKOWNIKOWI LUB ADMINOWI SYSTEMU
app.post('/Uzytkownik/Zablokuj_Uzytkownika', async (req, res) => {

    //const id_uzytkownik = 1; // TOKEN/(ID)???
    const id_uzytkownik = req.body.id;

    let czyZablokowano = true;

    pgClient.query("UPDATE Uzytkownik SET flaga=false WHERE id='" + id_uzytkownik+"'")
        .catch((error) => {
            console.log(error);
            czyZablokowano = false;
        });


    res.send({
        id: req.body.id,

        zwracam_czy_zablokowano: czyZablokowano
    });
});
//GOTOWE [(admin)] + DODAC ASPEKTY JESLI ZABLOKUJE MODERATORA GRUPY MOZLIWOSC PRZEKAZANIA PRAW INNEMU UZYTKOWNIKOWI LUB ADMINOWI SYSTEMU

// --------------------------------------------------------------
