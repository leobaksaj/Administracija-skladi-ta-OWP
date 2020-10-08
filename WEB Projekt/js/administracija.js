var aMaterijaliObject = []; //globalna polja elemenata 
var aKategorjieObject = [];
var aAktivnostObject = []; 

//Pravimo listu materijala i u nju pohranjujemo objekte iz BP

oDbMaterijali.on('value', function (oOdgovorPosluzitelja) {  //dohvaćanje podataka iz čvora materijali
                                                             //dohvaćanje se radi pozivom događaja "value" sa metodom on
    aMaterijaliObject = [];
    oOdgovorPosluzitelja.forEach(function (oMaterijaliSnapshot) {
        var sMaterijalKey = oMaterijaliSnapshot.key;
        var oMaterijal = oMaterijaliSnapshot.val();
        aMaterijaliObject.push({
            materijalKey: sMaterijalKey,
            skategorija: oMaterijal.kategorija,
            sifra: oMaterijal.sifra,
            naziv: oMaterijal.naziv,
            stanje: oMaterijal.trenutno_stanje
        });
    });
    $(document).ready(function () {  
        PopuniDropDown();
        PopuniTablicuPregledStanja();
        console.log(aMaterijaliObject);        
        PopuniTablicuAktivnosti();
        PopuniDropDown2();         
    });      
});

oDbKategorije.on('value', function (oOdgovorPosluzitelja) {
    aKategorjieObject = [];
    oOdgovorPosluzitelja.forEach(function (oKategorijaSnapshot) {
        var sKategorijaKey = oKategorijaSnapshot.key;
        var oKategorija = oKategorijaSnapshot.val();
        aKategorjieObject.push({
            kategorijaKey: sKategorijaKey,
            kategorija: oKategorija.naziv
        });
    });
    $(document).ready(function () {      
       
        PopuniTablicuAktivnosti();       
    });
    console.log(aMaterijaliObject);
});

oDbAktivnosti.on('value', function (oOdgovorPosluzitelja) {
    aAktivnostObject = [];
    oOdgovorPosluzitelja.forEach(function (oAktivnostSnapshot) {
        var sAktivnostKey = oAktivnostSnapshot.key;
        var oAktivnost = oAktivnostSnapshot.val();
        aAktivnostObject.push({
            aktivnostkey: sAktivnostKey,           
            tip_radnje: oAktivnost.Tip_radnje,
            vrijeme: oAktivnost.Vrijeme,
            Sifra_podatka: oAktivnost.sifra_podatka
        });
    });  
    $(document).ready(function () {
        console.log(aKategorjieObject);
        PopuniTablicuAktivnosti();
    });
});

function PopuniTablicuPregledStanja() {
    var oTablica = $('#TablicaStanja'); //ID tablice koja će se popuniti
    oTablica.find('tbody').empty(); //prazni se tbody element u tablici 
    var nRbr = 1;
    aMaterijaliObject.forEach(function (oMaterijal) {     
        var sRow = '<tr><td>' + nRbr++ + '</td><td>' + oMaterijal.sifra + '</td><td>' + oMaterijal.naziv + '</td><td>' + DajKategoriju(oMaterijal.skategorija) + '</td><td>' + oMaterijal.stanje + '</td><td><button onclick="ObrisiMaterijal(\'' + oMaterijal.materijalKey + '\')" type="button" id="delete" class="btn btn-danger" ><span class="glyphicon glyphicon-trash"></span></button></td><td><button onclick="ModalAzurirajMaterijal(\'' + oMaterijal.materijalKey + '\')" id="edit" class="btn btn-info" ><span class="glyphicon glyphicon-edit"></span></button></td</tr>';
        oTablica.find('tbody').append(sRow); //puni se redak po redak u tablici 
    });
}

function PopuniTablicuAktivnosti() {
    var oTablica = $('#TablicaAktivnost');
    oTablica.find('tbody').empty();
    var nRbr = 1;
    aAktivnostObject.forEach(function (oAktivnost) {
        var sRow = '<tr><td>' + nRbr++ + '</td><td>' + oAktivnost.tip_radnje + '</td><td>' + oAktivnost.vrijeme + '</td><td>' + oAktivnost.Sifra_podatka + '</td><tr>';
        oTablica.find('tbody').append(sRow);
    });
}

function DodajMaterijal() 
{
    var broj = 1000;
    var novaSifra;
    var varijabla; 
    //automatsko generiranje nove šifre materijala 
    for (var i = 0; i < aMaterijaliObject.length; i++)
    {
        varijabla = false;
        for (var j = 0; j < aMaterijaliObject.length; j++)
        {
            if (broj == aMaterijaliObject[j].sifra)
            {
                broj++;
                varijabla = true; 
            }
        }
        if (varijabla == false)
        {
            novaSifra = broj;
        }
    }    

    var sMaterijalNaziv = $('#inptNazivMaterijala').val(); //dohvaćanje vrijednosti iz modala  
    var nStanje = $('#inptStanjevMaterijala').val();
    var sKategorija = $('#KategorijaDropdown').val();    
    // Generiranje novoga ključa u bazi
    var sKey = firebase.database().ref().child('materijal').push().key;  

    var oMaterijal =
    {
        naziv: sMaterijalNaziv,
        sifra: novaSifra,
        trenutno_stanje: nStanje,
        kategorija: sKategorija
    };   
   
    // Zapiši u Firebase
    var oZapis = {};
    oZapis[sKey] = oMaterijal;
    oDbMaterijali.update(oZapis);
    //generiranje novog ključa u tablici aktivnost
    //upis aktivnosti u tablicu 
    var sKeyAct = firebase.database().ref().child('aktivnost').push().key;  
    var oAktivnost =
    {        
        Tip_radnje: "Dodavanje materijala",
        Vrijeme: DajVrijeme(),
        sifra_podatka: sMaterijalNaziv  + " (" + novaSifra +")"
    };  
    var oPodatak = {};
    oPodatak[sKeyAct] = oAktivnost;
    oDbAktivnosti.update(oPodatak); 
    $("#dodaj-materijal input").val("");  //ova linija prazni input elemente u modalu 
}

function DodajKategoriju()
{
    var sKategorijalNaziv = $('#inptNazivKategorije').val();
   
    // Generiranje novoga ključa u bazi
    var sKey = firebase.database().ref().child('kategorija').push().key;

    var oKategorija =
    {
        naziv: sKategorijalNaziv     
    };   
    // Zapiši u Firebase
    var oZapis = {};
    oZapis[sKey] = oKategorija;
    oDbKategorije.update(oZapis);

    var sKeyAct = firebase.database().ref().child('aktivnost').push().key;
    var oAktivnost =
    {
        Tip_radnje: "Dodavanje kategorije",
        Vrijeme: DajVrijeme(),
        sifra_podatka: sKategorijalNaziv
    };
    var oPodatak = {};
    oPodatak[sKeyAct] = oAktivnost;
    oDbAktivnosti.update(oPodatak);
    $("#dodaj-kategoriju input").val("");
}

function DajVrijeme()
{
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    return dateTime;
}

function ObrisiMaterijal(nSifraMaterijala)
{   
    var oMaterijalRef = oDb.ref('materijal/' + nSifraMaterijala); //pristupanje čvoru materijal, a preko šifre znamo koji materjial se želi obrisati 
    var sKeyAct = firebase.database().ref().child('aktivnost').push().key;
   
    var oAktivnost =
    {
        Tip_radnje: "Brisanje materijala",
        Vrijeme: DajVrijeme(),
        sifra_podatka: DajNazivMaterijala(nSifraMaterijala)
    };
    var oPodatak = {};
    oPodatak[sKeyAct] = oAktivnost;
    oDbAktivnosti.update(oPodatak);   
    obrisimaterijal(nSifraMaterijala);


    oMaterijalRef.remove();//uklanjanje materijala
}

function obrisimaterijal() {
    $('#modal-brisanje').modal('show');  


}

function ModalAzurirajMaterijal(nSifraMaterijala)
{
    var oMaterijalRef = oDb.ref('materijal/' + nSifraMaterijala);
    oMaterijalRef.once('value', function (oOdgovorPosluzitelja)
    {
        var oMaterijal = oOdgovorPosluzitelja.val();
        console.log(oMaterijal);
        //Popunjavanje elemenata forme za uređivanje
        $('#inptNazivMaterijalaEdit').val(oMaterijal.naziv);
        $('#inptSifraMaterijalaEdit').val(oMaterijal.sifra);
        $('#txtTrenutnoStanjeEdit').val(oMaterijal.trenutno_stanje);
        $('#KategorijaDropdownEdit').val(DajKategoriju(oMaterijal.kategorija));       
        //dodavanje događaja na gumb Ažuriraj
        $('#btnEdit').attr('onclick', 'SpremiAzuriranMaterijal("' + nSifraMaterijala + '")');
        //prikaži modal 
        $('#azuriraj-materijal').modal('show');
    });      
}

function SpremiAzuriranMaterijal(nSifraMaterijala)
{
    var oMaterijalRef = oDb.ref('materijal/' + nSifraMaterijala);

    var sMaterijalNaziv = $('#inptNazivMaterijalaEdit').val();
    var nSifra = $('#inptSifraMaterijalaEdit').val();
    var nStanje = $('#txtTrenutnoStanjeEdit').val();
    var sKategorija = $('#KategorijaDropdownEdit').val();
    
    var oMaterijal =
    {
        kategorija: sKategorija,
        naziv: sMaterijalNaziv,
        sifra: nSifra,
        trenutno_stanje: nStanje       
    };
    oMaterijalRef.update(oMaterijal);

    var sKeyAct = firebase.database().ref().child('aktivnost').push().key;
    var oAktivnost =
    {
        Tip_radnje: "Ažuriranje materijala",
        Vrijeme: DajVrijeme(),
        sifra_podatka: sMaterijalNaziv
    };
    var oPodatak = {};
    oPodatak[sKeyAct] = oAktivnost;
    oDbAktivnosti.update(oPodatak);
}

function DajKategoriju(nKategorijaID)
{
    var sKategorija ="";
    aKategorjieObject.forEach(function (oKategorija) { 
        if (nKategorijaID == oKategorija.kategorijaKey) {
            sKategorija = oKategorija.kategorija;
        }
    });
    return sKategorija;
}

function DajNazivMaterijala(nMaterijalID) {
    var sMaterijal = "";
    aMaterijaliObject.forEach(function (oMaterijal) {
        if (nMaterijalID == oMaterijal.materijalKey) {
            sMaterijal = oMaterijal.naziv;
        }
    });
    return sMaterijal;
}

function PopuniDropDown()
{  
    var oSelect = $('#KategorijaDropdown');
    oSelect.find('select');
    $('select').empty();
    aKategorjieObject.forEach(function (oKategorija) {         
        var option = '<option value="'+ oKategorija.kategorijaKey+ '">'+ oKategorija.kategorija + '</option>';       
        oSelect.append(option);    
    });
}

function PopuniDropDown2()
{
    var oSelect = $('#KategorijaDropdownEdit');
    oSelect.find('select'); 
    aKategorjieObject.forEach(function (oKategorija) {
        var option = '<option value="' + oKategorija.kategorijaKey + '">' + oKategorija.kategorija + '</option>';
        oSelect.append(option);
    });
    
}