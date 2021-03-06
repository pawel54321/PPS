﻿const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const fileUpload = require('express-fileupload');

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

app.use(fileUpload());

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
(async function () {
    await pgClient
        .query('CREATE TABLE IF NOT EXISTS Grupa_Pokoj (id SERIAL PRIMARY KEY, nazwa VARCHAR(255), opis VARCHAR(255), flaga BOOLEAN DEFAULT true)')
        .catch((error) => {
            console.log("Grupa_Pokoj" + error);
        });
    await pgClient
        .query('CREATE TABLE IF NOT EXISTS Uzytkownik (id SERIAL PRIMARY KEY, imie VARCHAR(255), nazwisko VARCHAR(255), login VARCHAR(255), haslo VARCHAR(255), prawa VARCHAR(255), flaga BOOLEAN DEFAULT true)')
        .catch((error) => {
            console.log("Uzytkownik" + error);
        });

    //REFERENCES

    await pgClient
        .query('CREATE TABLE IF NOT EXISTS Post_Komentarz (id SERIAL PRIMARY KEY, id_grupa INT REFERENCES Grupa_Pokoj (id), id_uzytkownik INT REFERENCES Uzytkownik (id), zawartosc VARCHAR(255), data VARCHAR(255), zalacznik VARCHAR(255))')
        .catch((error) => {
            console.log("Post_Komentarz" + error);
        });

    await pgClient
        .query('CREATE TABLE IF NOT EXISTS Zaproszenia (id SERIAL PRIMARY KEY, id_grupa INT REFERENCES Grupa_Pokoj (id), id_uzytkownik INT REFERENCES Uzytkownik (id), stan VARCHAR(255))')
        .catch((error) => {
            console.log("Zaproszenia" + error);
        });

    await pgClient
        .query('CREATE TABLE IF NOT EXISTS Tabela_Posrednia (id SERIAL PRIMARY KEY, id_grupa INT REFERENCES Grupa_Pokoj (id), id_uzytkownik INT REFERENCES Uzytkownik (id), moderator_grupy BOOLEAN)')
        .catch((error) => {
            console.log("Tabela_Posrednia" + error);
        });
    /*
    await pgClient
        .query('CREATE TABLE IF NOT EXISTS Polubienia (id SERIAL PRIMARY KEY, liczba_polubien INT, id_post INT REFERENCES Post_Komentarz (id), id_uzytkownik INT REFERENCES Uzytkownik (id))')
        .catch((error) => {
            console.log("Polubienia" + error);
        });*/
    //REFERENCES
})();
//TABELE


app.use(express.static('public'));

app.post('/upload', function (req, res) {

    //req.files.file.mimetype == "image/x-png" ||

    if (req.files.file.mimetype == "image/gif" || req.files.file.mimetype == "image/jpeg") //jpg
    {


        //console.log(req.);

        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('Załącznik nie został dodany na serwer.');
        }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let sampleFile = req.files.file;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv('./public/Upload/' + sampleFile.name, function (err) {
           // if (err)
            //    return res.status(500).send(err);

            res.send('Pomyślnie dodano załącznik!');
        });

    }
    else
    {
        res.send('Niepoprawny format!');
    }

   // res.send({ odpowiedz: req.body.get('file') });
   // res.send({ odpowiedz: req.files });

});



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

    //console.log(nazwa);
    //console.log(id_uzytkownik);

    let czyStworzono = false;
    const czyJestJuzNazwa = await pgClient.query("SELECT COUNT(nazwa) FROM Grupa_Pokoj WHERE nazwa='" + nazwa + "'");
    const tablicaCzyJestJuzNazwa = czyJestJuzNazwa.rows;
    if (tablicaCzyJestJuzNazwa[0].count == 1) {


        const grupa = await pgClient.query("SELECT id FROM Grupa_Pokoj WHERE nazwa='" + nazwa + "'");
        const tablicaGrupa = grupa.rows;

        //let id_grupy;

        //  if (Object.keys(tablicaGrupa).length != 0) {

        //console.log("tab" + tablicaGrupa[0].id);
        const id_grupy = tablicaGrupa[0].id;
        //console.log("id_grupa" + id_grupy);
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

                const admin = await pgClient.query("SELECT id FROM uzytkownik WHERE prawa='Admin'");
                const tablicaAdmin = admin.rows;

                const id_admin = tablicaAdmin[0].id;

                pgClient.query('INSERT INTO Tabela_Posrednia(id_grupa, id_uzytkownik, moderator_grupy) VALUES($1,$2,$3)', [id_grupy, id_admin, coZrobic])
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


//GOTOWE  (nie wyswietla zablokowanych userow w mojej grupie -> AND flaga=true) [(user/moderator)] wyswietla uzytkownikow z grupy gdzie jestem modem
app.post('/Grupa/Wyswietl/DanyLogin/Uzytkownicy', async (req, res) => {

    const nazwaGrupy = req.body.nazwaGrupy;
    const zapytanie = await pgClient.query("SELECT uz.id, uz.login, uz.imie, uz.nazwisko FROM Grupa_Pokoj as gr, tabela_posrednia as ta, uzytkownik as uz WHERE uz.id = ta.id_uzytkownik AND ta.id_grupa = gr.id AND ta.moderator_grupy=false AND gr.nazwa='" + nazwaGrupy + "' AND gr.flaga=true AND uz.flaga='true'");
    //console.log(zapytanie.rows);

    res.send({
        id: req.body.id,

        wyswietl: zapytanie.rows
    });
});
//GOTOWE [(user/moderator)] wyswietla uzytkownikow z grupy gdzie jestem modem

//GOTOWE  (nie wyswietla zablokowanych userow w mojej grupie -> AND flaga=true) [(user/moderator)] wyswietla uzytkownikow z grupy gdzie jestem modem
app.post('/Grupa/Wyswietl/DanyLogin/Uzytkownicy/Mod', async (req, res) => {

    const nazwaGrupy = req.body.nazwaGrupy;
    const zapytanie = await pgClient.query("SELECT uz.id, uz.login, uz.imie, uz.nazwisko FROM Grupa_Pokoj as gr, tabela_posrednia as ta, uzytkownik as uz WHERE uz.id = ta.id_uzytkownik AND ta.id_grupa = gr.id AND ta.moderator_grupy=true AND gr.nazwa='" + nazwaGrupy + "' AND gr.flaga=true AND uz.flaga='true'");
    //console.log(zapytanie.rows);

    res.send({
        id: req.body.id,

        wyswietl: zapytanie.rows
    });
});
//GOTOWE [(user/moderator)] wyswietla uzytkownikow z grupy gdzie jestem modem

//...

//GOTOWE [(moderator)]
app.post('/Grupa/Zablokuj_Uzytkownika_Z_Mojej_Grupy', async (req, res) => {

    const id_uzytkownik = req.body.id;
    const nazwaGrupy = req.body.nazwaGrupy;

    let czyZablokowano = true;

    const zapytanie = await pgClient.query("SELECT id FROM grupa_pokoj WHERE nazwa='" + nazwaGrupy + "'")
        .catch((error) => {
            console.log(error);
        });
        //console.log(zapytanie.rows);

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
//GOTOWE [(moderator)]

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

//ZAPROSZENIE USER ---> MODERATOR

//PORAWIC NIE DZIALA ZWROCENIE TYLKO TAM GDZIE NIE WYSLALEM PROSBY [(user/moderator/admin)] wyswietla grupy - Gdzie Nie Jestem + Gdzie Nie wysłalem prośby
app.post('/Grupa/Wyswietl/DanyLogin/Grupy_Gdzie_Nie_Jestem', async (req, res) => {

    const admin = await pgClient.query("SELECT id FROM uzytkownik WHERE prawa='Admin'");
    const tablicaAdmin = admin.rows;

    const id_admin = tablicaAdmin[0].id;

    const id = req.body.id;
    const zapytanie = await pgClient.query(
      "SELECT gr.id, gr.nazwa " +
      "FROM Grupa_Pokoj as gr, tabela_posrednia as ta, uzytkownik as uz " +
      "WHERE uz.id=ta.id_uzytkownik " +
      "AND ta.id_grupa=gr.id " +
      "AND uz.id<>'" + id + "' " +
      "AND uz.id<>'" + id_admin + "' " +
      "AND gr.flaga=true " +
      "AND ta.moderator_grupy=true " +
      "AND gr.id NOT IN ( " +
      	"SELECT za.id_grupa " +
      	"FROM Grupa_Pokoj as gr, zaproszenia as za, uzytkownik as uz " +
      	"WHERE uz.id=za.id_uzytkownik " +
      	"AND za.id_grupa=gr.id " +
      	"AND uz.id='" + id + "' " +
      	"AND gr.flaga=true " +
      ") " +
      "GROUP BY gr.id, gr.nazwa"
    );
    //console.log(zapytanie.rows);

    res.send({
        id: req.body.id,

        wyswietl: zapytanie.rows
    });
});
//PORAWIC NIE DZIALA ZWROCENIE TYLKO TAM GDZIE NIE WYSLALEM PROSBY [(user/moderator/admin)] wyswietla grupy - Gdzie Nie Jestem + Gdzie Nie wysłalem prośby


//GOTOWE [(user)]
app.post('/Zaproszenia/Dolacz_Wysylajac_Tylko_Zapytanie', async (req, res) => {
    const id = req.body.id;
    const grupa = req.body.grupa;

    const czyJestJuz = await pgClient.query("SELECT COUNT(id) FROM Zaproszenia WHERE id_uzytkownik='" + id + "' AND id_grupa='" + grupa + "'");
    const tablicaCzyJestJuz = czyJestJuz.rows;

    //console.log(tablicaCzyJestJuzNazwa[0].count);

    let czyStworzono = false;

    if (tablicaCzyJestJuz[0].count == 0) {
        pgClient.query('INSERT INTO Zaproszenia(id_uzytkownik, id_grupa, stan) VALUES($1,$2,$3)', [id, grupa, 'Oczekujace'])
            .catch((error) => {
                console.log(error);
            });

        czyStworzono = true;
        //  }
    }
    else {
        czyStworzono = false; // istnieje juz taka nazwa
    }

    res.send({
        id: req.body.id,
        grupa: req.body.grupa,

        zwracam_czy_stworzono: czyStworzono
    });
});
//GOTOWE [(user)]


//GOTOWE [(moderator)] wyswietla zaproszenie oczekujace
app.post('/Zaproszenia/Wyswietl/DanyLogin', async (req, res) => {


    /*
     GRUPA W KOTREJ JESTEM MODEM - MOJA GRUPA:


    SELECT gr.id, gr.nazwa FROM Grupa_Pokoj as gr, uzytkownik as uz, tabela_posrednia as ta
    WHERE uz.id = ta.id_uzytkownik AND ta.id_grupa = gr.id
    AND ta.id_uzytkownik = 2 AND ta.moderator_grupy=true
    AND gr.flaga = true

     LOGIN:

     SELECT uz.id, uz.login FROM Grupa_Pokoj as gr, uzytkownik as uz, zaproszenia as za
WHERE za.id_grupa = gr.id AND za.id_uzytkownik=uz.id
AND gr.flaga = true AND stan='Oczekujace' GROUP BY uz.id, uz.login


     */
    const id = req.body.id; //uz.id_uzytkownika
    //uz.login - wyswietla jaki mod zaprosił

    const zapytanie = await pgClient.query(
        "SELECT u.nazwa, uz.login, u.id " +
        "FROM ( " +
        	"SELECT gr.nazwa, gr.id " +
        	"FROM uzytkownik as uz, tabela_posrednia as ta, grupa_pokoj as gr " +
        	"WHERE uz.id=ta.id_uzytkownik " +
          "AND gr.id=ta.id_grupa " +
        	"AND uz.id='" + id + "'" +
        	"AND ta.moderator_grupy=true " +
          "AND gr.flaga=true " +
        ")u, Grupa_Pokoj as gr, zaproszenia as za, uzytkownik as uz " +
        "WHERE uz.id=za.id_uzytkownik " +
        "AND gr.id=za.id_grupa " +
        "AND uz.id<>'" + id + "'" +
        "AND gr.flaga=true " +
        "AND u.id=gr.id " +
        "AND za.stan='Oczekujace' " +
        "GROUP BY u.nazwa, uz.login, u.id"
      );
    //console.log(zapytanie.rows);

    res.send({
        id: req.body.id,

        wyswietl: zapytanie.rows
    });
});
//GOTOWE [(moderator)] wyswietla zaproszenie oczekujace


//GOTOWE [(modearator grupy)] IF AKCEPTACJA WYWOLAC DOLACZENI DO GRUP
app.post('/Zaproszenia/Akceptacja_Lub_Odrzucenie_Zaproszenie_Uzytkownika_Do_Grupy', async (req, res) => {

    //const id_uzytkownik = 1; // TOKEN/(ID)???
    const login = req.body.login;
    const grupa = req.body.grupa;
    const coZrobic = req.body.coZrobic; // Zaakceptowane / Odrzucone

    let czyZablokowano = true;

    const id_u = await pgClient.query("SELECT id FROM uzytkownik WHERE login='" + login + "'")
        .catch((error) => {
            console.log(error);
            czyZablokowano = false;
        });
    const id_uzytkownik = id_u.rows[0].id;

    const id_g = await pgClient.query("SELECT id FROM grupa_pokoj WHERE nazwa='" + grupa + "'")
        .catch((error) => {
            console.log(error);
            czyZablokowano = false;
        });
    const id_grupa = id_g.rows[0].id;

    pgClient.query("UPDATE Zaproszenia SET stan='" + coZrobic + "' WHERE id_uzytkownik='" + id_uzytkownik + "' AND id_grupa='" + id_grupa + "'")
        .catch((error) => {
            console.log(error);
            czyZablokowano = false;
        });

    const czyJestJuz = await pgClient.query("SELECT COUNT(id) FROM tabela_posrednia WHERE id_uzytkownik='" + id_uzytkownik + "' AND id_grupa='" + id_grupa + "'");
    const tablicaCzyJestJuz = czyJestJuz.rows;

    if(coZrobic == 'Zaakceptowane' && tablicaCzyJestJuz[0].count==0) {

        pgClient.query("INSERT INTO tabela_posrednia (id_uzytkownik, id_grupa, moderator_grupy) VALUES ('" + id_uzytkownik + "', '" + id_grupa +"', 'false')")
            .catch((error) => {
                console.log(error);
                czyZablokowano = false;
            });
    }

    res.send({
        id: req.body.id,
        coZrobic: req.body.coZrobic,

        zwracam_czy_zablokowano: czyZablokowano
    });
});
//GOTOWE [(modearator grupy)]  IF AKCEPTACJA WYWOLAC DOLACZENI DO GRUP

//GOTOWE [(user/moderator)] wyswietla grupy gdzie jestem
app.post('/Grupa/Wyswietl/DanyLogin/User', async (req, res) => {

    const id = req.body.id;
    const zapytanie = await pgClient.query("SELECT gr.id, gr.nazwa, gr.opis FROM Grupa_Pokoj as gr, tabela_posrednia as ta, uzytkownik as uz WHERE uz.id = ta.id_uzytkownik AND ta.id_grupa = gr.id AND uz.id ='" + id +"' AND gr.flaga=true");
    //console.log(zapytanie.rows);

    res.send({
        id: req.body.id,

        wyswietl: zapytanie.rows
    });
});
//GOTOWE [(user/moderator)] wyswietla grupy gdzie jestem modem powinno byc DanyLogin/Grupy





//..............

//GOTOWE [(user/moderator/admin)]
app.post('/Post/Stworz', async (req, res) => {
    const id_uzytkownik = req.body.id_uzytkownik;
    const grupa = req.body.grupa;
    const zawartosc = req.body.zawartosc;
    const data = req.body.data;

    const urlzalacznik = req.body.urlzalacznik;

    let czyStworzono = false;

    console.log(urlzalacznik);

    const id = await pgClient.query("SELECT id FROM grupa_pokoj WHERE nazwa='" + grupa + "'");
    const id_grupa = id.rows[0].id;

    /*
currentDate.getHours() + ":" + currentDate.getMinutes() + ":"+currentDate.getSeconds()
currentDate.getDate() + "." + (currentDate.getMonth()+1) + "." + currentDate.getFullYear();
     */
    pgClient.query('INSERT INTO Post_Komentarz(id_uzytkownik, id_grupa, zawartosc, data, zalacznik) VALUES($1, $2, $3, $4, $5)', [id_uzytkownik, id_grupa, zawartosc, data, urlzalacznik ])
        .catch((error) => {
            console.log(error);
            czyStworzono = false;
        }
    ).then(czyStworzono = true);


    res.send({
        id_uzytkownik: req.body.id_uzytkownik,
        id_grupa: id_grupa,
        zawartosc: req.body.zawartosc,
        data: req.body.data,
        urlzalacznik: req.body.urlzalacznik,

        zwracam_czy_stworzono: czyStworzono
    });
});
//GOTOWE [(user/moderator/admin)]



//GOTOWE [(user/moderator/admin)]
app.post('/Post/Wyswietl/Grupa', async (req, res) => {

    const grupa = req.body.grupa;

    const id = await pgClient.query("SELECT id FROM grupa_pokoj WHERE nazwa='" + grupa + "'");
    const id_grupa = id.rows[0].id;

    const zapytanie = await pgClient.query("SELECT * FROM Post_Komentarz as pk, uzytkownik as uz WHERE pk.id_grupa='" + id_grupa+"' AND uz.id=pk.id_uzytkownik ORDER BY pk.data DESC")


    res.send({
        id_grupa: req.body.id_grupa,

        wyswietl: zapytanie.rows
    });
});
//GOTOWE [(user/moderator/admin)]




//GOTOWE [(user/moderator/admin)]
app.post('/Post/Wyswietl/DanyLogin', async (req, res) => {

    const id_uzytkownik = req.body.id_uzytkownik;
    const id_grupa = req.body.id_grupa;

    const zapytanie = await pgClient.query("SELECT * FROM Post_Komentarz WHERE id_uzytkownik='" + id_uzytkownik+"' AND id_grupa='" + id_grupa+"'")


    res.send({
        id_uzytkownik: req.body.id_uzytkownik,
        id_grupa: req.body.id_grupa,

        wyswietl: zapytanie.rows
    });
});
//GOTOWE [(user/moderator/admin)]


//WYSWIETLA ALL POLUBIENIA
/*
 SELECT pol.liczba_polubien, pol.id_post, pol.id_uzytkownik
	FROM polubienia as pol, uzytkownik as uz, post_komentarz as pos
	WHERE pos.id=pol.id_post AND pol.id_uzytkownik=uz.id


  */





//XXXXXXXXXXXXXXXXXXXXXXXXX

//ZAPROSZENIE MODERATOR ---> USER NIE MA CZASU NIE ROBIMY ODWROTNIE

//GOTOWE [(moderator)]
/*app.post('/Zaproszenia/Wyslij_Zapytanie', async (req, res) => {
    const id = req.body.id;
    const grupa = req.body.grupa;

    const czyJestJuz = await pgClient.query("SELECT COUNT(id) FROM Zaproszenia WHERE id_użytkownik='" + id + "' AND id_grupa='" + grupa + "'");
    const tablicaCzyJestJuz = czyJestJuz.rows;

    //console.log(tablicaCzyJestJuzNazwa[0].count);

    let czyStworzono = false;

    if (tablicaCzyJestJuz[0].count == 0) {
        pgClient.query('INSERT INTO Zaproszenia(id_użytkownik, id_grupa, stan) VALUES($1,$2,$3)', [id, grupa, 'Oczekujace'])
            .catch((error) => {
                console.log(error);
            });

        czyStworzono = true;
        //  }
    }
    else {
        czyStworzono = false; // istnieje juz taka nazwa
    }

    res.send({
        id: req.body.id,
        grupa: req.body.grupa,

        zwracam_czy_stworzono: czyStworzono
    });
});*/
//GOTOWE [(moderator)]

//.... + WYSWETLANIE BUTTONA PRZY UZYTKOWNIKU KOTREGO ZARPASZAM .....


//XXXXXXXXXXXXXXXXXXXXXXXXX
