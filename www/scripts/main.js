document.addEventListener("deviceready", onDeviceReady, false);

function populateDB(tx) {
    //tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER PRIMARY KEY ASC, a VARCHAR(100), b VARCHAR(100) )');
}

function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    var len = results.rows.length;
    console.log("DEMO table: " + len + " rows found.");
    for (var i=0; i<len; i++){
        console.log("Row = " + i + " ID = " + results.rows.item(i).id + " a =  " + results.rows.item(i).a + " b = " + results.rows.item(i).b);
    }
 }

function errorCB(err) {
    console.log("Error processing SQL: "+err.code);
}

function successCB() {
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(queryDB, errorCB);
}

function onDeviceReady() {
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(populateDB, errorCB, successCB);
}




$('#add-new-page').live('pagebeforeshow',function(event, ui){
	$(function(){
	  	$('.save-to').click(function(){
			var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
			console.log("successfully connected to DB");
      		db.transaction(queryDB, errorCB);
		});

		function queryDB(tx) {
			var note = $("input.note-title").val();
			var note_detail = $(".note-details").val();
			if(note == ""){
				alert("nothing to save");
			}
			else {
				tx.executeSql('INSERT INTO DEMO (a, b) VALUES (?,?)',[note,note_detail]);
			}
			//alert(note_detail);
			
			//alert("successfully inserted");
		 }

		function errorCB(err) {
		    console.log("Error processing SQL: "+err.code);
   		}

	});
});





$('#all-lists-page').live('pagebeforeshow',function(event, ui){
	$(function(){
		$('a.details').live('click', function() {
			id_number = $(this).find('.id-number').text();
			localStorage.setItem('todo', id_number);
			//alert(id_number);
		});
		
		$(function(){
			var db_new = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
	        db_new.transaction(queryDB, errorCB);
		});
		
		function queryDB(tx) {
		  tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
		}

		function querySuccess(tx, results) {
		    var len = results.rows.length;
		    console.log("DEMO table: " + len + " rows found.");
		    for (var i=0; i<len; i++){
		        $(".lists").append("<div class='notes'><a href='list-details.html' data-transition='slide' class='details'>" + "<span class='id-number'>" + results.rows.item(i).id  + "</span>" + results.rows.item(i).a + "<span class='right-arrow'></span></a></div>" );
		    }
		  	var n = $("#all-lists-page .lists").text();
			if(n == "") {
				$(".lists").append("<div class='no-content mtop15'>No Notes Found</div>");
			}
			else {
				//alert("has content");
			}
		}

		function errorCB(err) {
		    console.log("Error processing SQL: "+err.code);
		}
		
	});
});


	

$('#list-details-page').live('pagebeforeshow',function(event, ui){

	$(function(){
		var db_new = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
		db_new.transaction(queryDB, errorCB);
		updatedNo = localStorage.getItem('todo');
		//alert(updatedNo);
	});
	
	function queryDB(tx) {
		tx.executeSql('SELECT a, b FROM DEMO WHERE id= ? ;', [updatedNo], querySuccess, errorCB);
	}

	function querySuccess(tx, results) {
		var len = results.rows.length;						
		console.log("DEMO table: " + len + " rows found.");
		$("h1.header-wrap").text(results.rows.item(0).a);
		//alert(results.rows.item(0).b);
		$(".lists").append("<div class='note-description'>" + results.rows.item(0).b  + "</div><a href='edit-note.html' data-transition='slideup' class='edit-note'></a>" );
	}

	function errorCB(err) {
		console.log("Error processing SQL: "+err.code);
	}

	$(function(){
	  	$('.delete-note').click(function(){
			//alert("clicked delete button");
			var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
			console.log("successfully connected to DB");
	  		db.transaction(newqueryDB, newerrorCB);
		  });

		function newqueryDB(tx) {
			tx.executeSql('DELETE FROM DEMO WHERE ID= ?',[updatedNo]);
			alert("deleted");
		 }

		function newerrorCB(err) {
	        console.log("Error processing SQL: "+err.code);
	    }

	});

});


$('#edit-note-page').live('pagebeforeshow',function(event, ui){

	$(function(){
     	var db_new = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
     	db_new.transaction(queryDB, errorCB);
		updatedNo = localStorage.getItem('todo');
		//alert(updatedNo);
	});
		
	function queryDB(tx) {
 		tx.executeSql('SELECT a, b FROM DEMO WHERE id= ? ;', [updatedNo], querySuccess, errorCB);
 	}

 	function querySuccess(tx, results) {
 		var len = results.rows.length;						
     	console.log("DEMO table: " + len + " rows found.");
     	$(".note-title").val(results.rows.item(0).a);
		$(".note-details").val(results.rows.item(0).b);
 	}

 	function errorCB(err) {
     console.log("Error processing SQL: "+err.code);
 	}


	$(function(){
	  $('.save-to').click(function(){
		var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
		console.log("successfully connected to DB");
	    db.transaction(newqueryDB, newerrorCB);
	   });

		function newqueryDB(tx) {
			var note = $("input.note-title").val();
			var note_detail = $(".note-details").val();
			tx.executeSql('UPDATE DEMO set a= ?, b= ? WHERE ID= ?' ,[note, note_detail, updatedNo]);
			//alert(note + "and" + note_detail);
    	}
	
		function newerrorCB(err) {
		    console.log("Error processing SQL: "+err.code);
	    }
	});
});

$('#camera-page').live('pageshow',function(event, ui){
	$(function(){
        $("#takePhotoButton").live("click", function() {
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50 }); 
        });
		function onSuccess(imageData) {
		    var image = document.getElementById('myImage');
		    image.src = "data:image/jpeg;base64," + imageData;
		}

		function onFail(message) {
		    alert('Failed because: ' + message);
		}
	});	
});

$('#geolocation-page').live('pageshow',function(event, ui){
	$(function(){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
	});	

    function onSuccess(position) {
        var element = document.getElementById('geolocation');
        element.innerHTML = 'You have been located in <br /><br />' +
							'Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />' +
                            'Accuracy: '           + position.coords.accuracy              + '<br />' +
                            'Timestamp: '          + new Date(position.timestamp)          + '<br />';
    }

    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
});

$('#contacts-page').live('pageshow',function(event, ui){
	$(function(){
	  	$('.save-contact').click(function(){
			var contact = navigator.contacts.create();
	        var name = new ContactName();
	        name.givenName = $(".contact-name").val();
			contact.name = name;
			
			var worknumber = $(".contact-wnumber").val()
			var mobilenumber = $(".contact-mnumber").val()
			
			var phoneNumbers = [2];
			phoneNumbers[0] = new ContactField('work', worknumber, false);
			phoneNumbers[1] = new ContactField('mobile', mobilenumber, true); 
			contact.phoneNumbers = phoneNumbers;
			

	        contact.save(onSaveSuccess,onSaveError);
		});

		function onSaveSuccess(contact) {
	        alert("Contact Saved Successfully");
	    }

	    function onSaveError(contactError) {
	        alert("Error = " + contactError.code);
	    }

	});
});

