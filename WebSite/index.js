/* Patrick: 
    26/01/2024 :
	Ajout 
	MQTT Web Application : web MQTT avec HTML et Javascript
	Ajout affichage position Appareil de voie
		
	19/08/2023 : 
	Commande aiguillage via TCO de Patrick 
    prend en compte un click sur chaque image, change image et renvoi position des Apps !*/

// Etat initial position des Appareils de voie
let i = 0;
let app1 = 12;  // app 1, pos. Direct 1 ; pos Devié 2
let app2 = 22;  // app 2, pos. Gauche 1 ; pos Droite 2
let app3 = 33;
let app4 = 41;  // app 4, pos. Direct 1 ; pos Devié 2
let app5 = 51;  // app 5, pos. Direct 1 ; pos Devié 2
let app6 = 63;

document.getElementById("App1").innerHTML=app1;
document.getElementById("App2").innerHTML=app2;
document.getElementById("App3").innerHTML=app3;
document.getElementById("App4").innerHTML=app4;
document.getElementById("App5").innerHTML=app5;
document.getElementById("App6").innerHTML=app6;
	
let PosApps = [app1, app2, app3, app4, app5, app6];
// let RetPosApps = [1,0,0,1,1,0,1,0,1,0,1,0,1,0,1,0];  // State Aig init  10 01   10 10   10 10   10 10

//console.log("Position1 des app:" +PosApps +" et Retour:"+ RetApps);
console.log("Position1 des app:" +PosApps);


var topic_pub;
var mess_pub;
var topic_sub;
var mess_sub;
var topic_arr;
var mess_arr;
var mqtt;
var reconnectTimeout = 2000;
var toto;
var flag_class ;
var aig_id;
var flag3 = 0;
var flag6 = 0;

let aigs = document.querySelectorAll(".case");
aigs.forEach((app) => {
  app.addEventListener("click", (e) => {
    e.stopPropagation();
   toto = e.target;				
   topic_arr = 0;
   mess_arr = 0;
	topic_pub = "Aig/Cde";
	topic_sub = "Aig/Pos";	
    /* ******************************************************* 
            aig_pos_br_1; app1
      ****************************************************** */
    let c1 = toto.classList.contains("aig_pos_br_1");
    if (c1) {
    	app1 = 11;
	    //PosApps[0] = 2;
		toto.src = "sprites/aiguilles_move.png";
	  	toto.className = "aig_pos_br_2";
		document.getElementById('Mess_pub').value = app1;  // cde pour Aig Dévié
		document.getElementById('Topic_pub').value = topic_pub;
		publishMessage();
		}	   
		else if (toto.classList.contains("aig_pos_br_2")) {
		app1 = 12;
		//PosApps[0] = 1;
		toto.src = "sprites/aiguilles_move.png";
        toto.className = "aig_pos_br_1";
		document.getElementById('Mess_pub').value = app1; // cde pour Aig Droit
		document.getElementById('Topic_pub').value = topic_pub ;
		publishMessage();
	    }	
		 
    /* ******************************************************* 
            aig_pos_fork_r_1; app2
      ****************************************************** */
    let c2 = toto.classList.contains("aig_pos_fork_r_1");
    if (c2) {
        toto.className = "aig_pos_fork_r_2";
        app2 = 21;
	    //PosApps[1] = 2;
	    toto.src = "sprites/aiguilles_move.png";
	    document.getElementById('Mess_pub').value = app2; 
	    document.getElementById('Topic_pub').value = topic_pub ;
		publishMessage();
      } else if (toto.classList.contains("aig_pos_fork_r_2")) {
        toto.className = "aig_pos_fork_r_1";
        app2 = 22;
	    //PosApps[1] = 1;
		toto.src = "sprites/aiguilles_move.png";
		document.getElementById('Mess_pub').value = app2; 
	    document.getElementById('Topic_pub').value = topic_pub ;
		publishMessage();
    }
    /* ******************************************************* 
            aig1_pos_tri_r_1; app3
            {direct app-=1, droite app=2, gauche app=3}
      ****************************************************** */
    let c3 = toto.classList.contains("aig1_pos_tri_r_1"); //  // si direct 31-34 -->  droite 32-34
    if (c3 && flag3 == 0) {
        toto.className = "aig1_pos_tri_r_2"; //  -->   droite 32-34
        app3 = 32;
	    //PosApps[2] = 2;
		toto.src = "sprites/aiguilles_move.png";
		document.getElementById('Mess_pub').value = app3; 
	    document.getElementById('Topic_pub').value = topic_pub ;
		publishMessage();
	 } else if ((c3 = toto.classList.contains("aig1_pos_tri_r_2"))&& flag3==0) {   // Si droite 32-34 --> direct 31-34  
      // si droite, d'abord direct puis gauche
		toto.className = "aig1_pos_tri_r_1";     // --> direct 31-34  
		app3 = 31;
		//PosApps[2] = 3;
		toto.src = "sprites/aiguilles_move.png"
		document.getElementById('Mess_pub').value = app3; 
		document.getElementById('Topic_pub').value = topic_pub ;
		flag3 = 1;
		console.log(" flag3 : " +flag3 );
		publishMessage();
	 } else if ((c3 = toto.classList.contains("aig1_pos_tri_r_1")) && flag3==1) {  //  si direct 31-34 -->  gauche 31-33
      // si droite, d'abord direct puis gauche
		toto.className = "aig1_pos_tri_r_3";  //  -->  gauche 31-33
		app3 = 33;
		PosApps[2] = 1;
		toto.src = "sprites/aiguilles_move.png";
		document.getElementById('Mess_pub').value = app3; 
		document.getElementById('Topic_pub').value = topic_pub ;
		flag3 = 0;
		console.log(" flag3 : " +flag3 );
		publishMessage(); 
    } else if ((c3 = toto.classList.contains("aig1_pos_tri_r_3"))) { // si gauche 31-33  --> direct --> 31-34
      // si gauche ->direct
      toto.className = "aig1_pos_tri_r_1";  //   --> direct --> 31-34
      app3 = 34;
	  //PosApps[2] = 1;
		toto.src = "sprites/aiguilles_move.png";
		document.getElementById('Mess_pub').value = app3; 
		document.getElementById('Topic_pub').value = topic_pub ;
		publishMessage();
    }
    /* ******************************************************* 
            aig_pos_bl_1; app4
      ****************************************************** */
    if ((c4 = toto.classList.contains("aig_pos_bl_1"))) {
      // si direct -> gauche
		  toto.className = "aig_pos_bl_2";
		  app4 = 41;
		  //PosApps[3] = 2;
		  toto.src = "sprites/aiguilles_move.png";
		  document.getElementById('Mess_pub').value = app4; 
		  document.getElementById('Topic_pub').value = topic_pub ;
		  publishMessage();
    } else if (toto.classList.contains("aig_pos_bl_2")) {
		  toto.className = "aig_pos_bl_1";
		  app4 = 42;
		  //PosApps[3] = 1;
		  toto.src = "sprites/aiguilles_move.png";
		  document.getElementById('Mess_pub').value = app4; 
		  document.getElementById('Topic_pub').value = topic_pub ;
		  publishMessage();
    }
    /* ******************************************************* 
           aig_pos_tl_1; app5
     ****************************************************** */
    let c5 = toto.classList.contains("aig_pos_tl_1"); //si direct -> droite
    if (c5 ) {
		  toto.className = "aig_pos_tl_2";
		  app5 = 52;
		  //PosApps[4] = 2;
		  toto.src = "sprites/aiguilles_move.png";
		  document.getElementById('Mess_pub').value = app5; 
		  document.getElementById('Topic_pub').value = topic_pub ;
		  publishMessage();
    } else if (toto.classList.contains("aig_pos_tl_2")) {
		  toto.className = "aig_pos_tl_1";
		  app5 = 51;
		  //PosApps[4] = 1;
		  toto.src = "sprites/aiguilles_move.png";
		  document.getElementById('Mess_pub').value = app5; 
		  document.getElementById('Topic_pub').value = topic_pub ;
		  publishMessage();
    }	
    /* ******************************************************* 
            aig_pos_tri_r_1; app6
            {direct app-=1, droite app=2, gauche app=3}
      ****************************************************** */
	let c6 = toto.classList.contains("aig_pos_tri_r_1") ; // si direct 61-64 -->  droite 62-64
    if (c6 && flag6 == 0) {
      toto.className = "aig_pos_tri_r_2"; //   --> droite 62-64
      app6 = 62;
	  //PosApps[5] = 2;
	  toto.src = "sprites/aiguilles_move.png";
	  document.getElementById('Mess_pub').value = app6; 
	  document.getElementById('Topic_pub').value = topic_pub ;
	  publishMessage();      
    } else if ((c6 = toto.classList.contains("aig_pos_tri_r_2"))&& flag6 == 0) {  // Si droite 62-64 --> direct 61-64  
      // si droite, d'abord direct puis gauche
      toto.className = "aig_pos_tri_r_1"; //  --> direct 61-64
	  app6 = 61;
	  //PosApps[5] = 3;
	  toto.src = "sprites/aiguilles_move.png";
	  document.getElementById('Mess_pub').value = app6; 
	  document.getElementById('Topic_pub').value = topic_pub ;
	  flag6 = 1;
	  console.log(" flag6 : " +flag6 );
	  publishMessage();
	} else if ((c6 = toto.classList.contains("aig_pos_tri_r_1")) && flag6==1) { //  si direct 61-64 -->  gauche 61-63
      //  puis gauche
	  toto.className = "aig_pos_tri_r_3"; //  -->  gauche 61-63
	  app6 = 63;
	  //PosApps[5] = 1;
	  toto.src = "sprites/aiguilles_move.png";
	  document.getElementById('Mess_pub').value = app6; 
	  document.getElementById('Topic_pub').value = topic_pub ;
	  flag6 = 0;
	  console.log(" flag6 : " +flag6 );
	  publishMessage(); 
    } else if ((c6 = toto.classList.contains("aig_pos_tri_r_3"))) {  // si gauche 61-63  --> direct --> 61-64
      toto.className = "aig_pos_tri_r_1"; // --> direct --> 61-64
      app6 = 64;
	  //PosApps[5] = 1;
	  toto.src = "sprites/aiguilles_move.png";
	  document.getElementById('Mess_pub').value = app6; 
	  document.getElementById('Topic_pub').value = topic_pub ;
	  publishMessage();      
    }

	/* ******************************************************* */
    // let PosApps = [app1, app2, app3, app4, app5, app6];
	// console.log("Position1 des app:" +PosApps +" et Retour:"+ RetApps);
	console.log("Position1 des app:" +PosApps);
	document.getElementById("App1").innerHTML=app1;
	document.getElementById("App2").innerHTML=app2;
	document.getElementById("App3").innerHTML=app3;
	document.getElementById("App4").innerHTML=app4;
	document.getElementById("App5").innerHTML=app5;
	document.getElementById("App6").innerHTML=app6;	
  });
});

function startConnect(){
	if (typeof path == "undidefined"){
		path == '/mqtt';
	}
   	
	clientID = "web_" + parseInt(Math.random() * 100, 10);
	mqtt = new Paho.MQTT.Client(host,port,"web_" + clientID);
	
    document.getElementById("messages").innerHTML += "<span> > Connecting to " + host + " on port " + port + "</span>";
    document.getElementById("messages").innerHTML += "<span> > Using the client Id : " + clientID + " </span>";
	document.getElementById("host").value = host;
	document.getElementById("port").value = port;
	document.getElementById("client").value = clientID;
	// document.getElementById("topic").value = topic;
	
        mqtt.onConnectionLost = onConnectionLost;
        mqtt.onMessageArrived = onMessageArrived;

        if (username != null) {
            options.userName = username;
            options.password = password;
        }
        console.log("> clientID : " +clientID + ", Host="+ host + ", port=" + port + ", path=" + path + " TLS = " + useTLS + " username=" + username + " password=" + password);
        // mqtt.connect(options);
		mqtt.connect({
			onSuccess: onConnect
		});
    }
function onConnect(){
	console.log();
    topic =  document.getElementById("Topic_sub").value;
	console.log("Connected & subscribing to topic_sub: "+topic);
    document.getElementById("messages").innerHTML += "<span> & Subscribing to topic_sub "+topic + "</span><br>";
    mqtt.subscribe(topic);
}

function onConnectionLost(responseObject){
    document.getElementById("messages").innerHTML += "<span> ERROR: Connection is lost. </span>";
    if(responseObject !=0){
        document.getElementById("messages").innerHTML += "<span> connection lost : "+ responseObject.errorMessage + " --> </span>";
    }
}

function startDisconnect(){
    mqtt.disconnect();
	console.log(" Starting MQTTwebapp Disconnect " );
    document.getElementById("messages").innerHTML += "<span> Starting MQTTwebapp Disconnect </span><br>";
}

function onMessageArrived(message ){
    document.getElementById("Mess_sub").value = message.payloadString;
	document.getElementById("Topic_sub").value = message.destinationName; 
	mess_arr = message.payloadString;
	topic_arr = message.destinationName;
	mess_pub = document.getElementById("Mess_pub").value;
	topic_pub = document.getElementById("Topic_pub").value;
	
	i = mess_arr;
	i = Math.floor(i/10); 
	console.log(" valeur de i : "+i);
		
	console.log(" Arriving Message  : " +message.payloadString+ " on Topic : " +message.destinationName + " --> topic_pub : " +topic_pub+ " mess_pub : " +mess_pub);
	document.getElementById("messages").innerHTML += "<span>   -->>  Arriving Message : "+message.payloadString +  " < on Topic > " +message.destinationName+" --> topic_arr :" +topic_arr + " mess_arr :" + mess_arr +"</span><br>";
		
	if ( mess_arr == mess_pub){
		document.getElementById("Mess_sub").style = "color:black;border-color:black;font-weight:normal"; 
	  switch(i){
		case 1:
			document.getElementById('1').src = "sprites/aiguilles.png";
			break;
		case 2:
			document.getElementById('2').src = "sprites/aiguilles.png";
			break;
		case 3:
			document.getElementById('3').src = "sprites/aiguilles.png";
			break;
		case 4:
			document.getElementById('4').src = "sprites/aiguilles.png";
			break;
		case 5:
			document.getElementById('5').src = "sprites/aiguilles.png";
			break;
		case 6:
			document.getElementById('6').src = "sprites/aiguilles.png";
			break;
		default :	
			document.getElementById("messages").innerHTML += "<span> Wrong message for Aigs position :" + mess_arr+ " </span><br>";
			document.getElementById("Mess_sub").value = message.payloadString;
	  }	
		console.log(" identical message : arr --> " +mess_arr+ " pub --> "  +mess_pub);

	}else {
		document.getElementById("messages").innerHTML += "<span> Warning Wrong Message : arr --> " +mess_arr+ " pub --> "  +mess_pub+ "</span><br>";
		console.log(" wrong message ");
		document.getElementById("Mess_sub").style = "color:red;border-color:red;font-weight:bold"; 
	}
 }


function publishMessage(msg, topic){
 mess_pub =  document.getElementById("Mess_pub").value;
 topic_pub = document.getElementById("Topic_pub").value;
 console.log("Publishing message : "+mess_pub + ", on topic_pub: " +topic_pub );

Message = new Paho.MQTT.Message(mess_pub);
Message.destinationName = topic_pub;
// message.qos = 0
mqtt.send(Message);
document.getElementById("messages").innerHTML = "<span>  Publishing Message : > " + mess_pub + " < to topic > "+topic_pub+ "</span>";
}


