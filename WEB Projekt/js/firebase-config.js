	// Your web app's Firebase configuration
	var firebaseConfig = {
		apiKey: "AIzaSyAnNa-pnDw5T4nLd-aRH2Aos181eoVpdFo",
		authDomain: "gradevinskimaterijal-45c14.firebaseapp.com",
		databaseURL: "https://gradevinskimaterijal-45c14.firebaseio.com",
		projectId: "gradevinskimaterijal-45c14",
		storageBucket: "gradevinskimaterijal-45c14.appspot.com",
		messagingSenderId: "650894601202",
		appId: "1:650894601202:web:d28d4a5e9eba16913e996b",
		measurementId: "G-3WS35X8ZBZ"
	};
	// Initialize Firebase
firebase.initializeApp(firebaseConfig);	
firebase.analytics();
var auth = firebase.auth();
// Kreiranje objekta Firebase baze
var oDb = firebase.database(); //kompletna baza
var oDbMaterijali = oDb.ref('materijal');	//čvor materijal 
var oDbKategorije = oDb.ref('kategorija');
var oDbAktivnosti = oDb.ref('aktivnost');


