function login()
{	
	var userEmail = $("#email_field").val();
	var userPass = $("#password_field").val();
	
	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(error =>
	{
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;			
		$("#loginAlert").text("Error: " + errorMessage);		
	});

	firebase.auth().onAuthStateChanged(user => {
		if (user) {
			window.location.href = "index.html";				
		}
		else {
			
		}
	});
	$("email_field").val("");
	$("#password_field").val("");
	console.log("radi");
}


function logout() {	
	firebase.auth().signOut();	
	window.location.href = "login.html";
}