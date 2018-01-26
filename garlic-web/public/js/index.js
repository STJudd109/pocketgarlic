// A $( document ).ready() block.
$(document).ready(function() {
	if (localStorage.wallets) {
		$(".lrg-add").hide();
		load_cards();
		total_bal();
		gen_words();
	} else {
		console.log("nothing saved");
		$(".clear-data").hide();
		$(".table").hide();
		$(".small-add").hide();
	};
	
	if (localStorage.newwalletformat) {
		//
	} else {
		if (localStorage.wallets){
			localStorage.removeItem("wallets");
			localStorage.setItem('newwalletformat', 1);
			$.when(alert("The format has changed, please re-enter the wallet address")).then(function(){
				window.location.reload(true)
			});
			// window.location.reload(true);
		} else {
			localStorage.setItem('newwalletformat', 1);
		};

	}
});

//check
$("#button-check").click(function() {
	var address = document.getElementById("address").value;
	if(address != ""){
		fetch_wallet(address);
	} else {
		//nothing
	}
	
});
// GJobvUEzqnfWT8kXhGdf95bPE19EocYgWJ
// Retrieve

//Save
$("#button-save").click(function() {
	var address = $("#wallet-address").val();
	var name = $("#wallet-alias").val();
	var pool = $("#wallet-pool").val();
	console.log(address + " " +name + " " + pool);
	json_store(address, name, pool);
	window.location.reload(true);
});

$(".jumbotron").click(function() {
	window.location.reload(true);
});

//clear storage
$("#button-clear").click(function() {
	localStorage.removeItem("wallets");
	window.location.reload(true);
});

function get_store(){
	var temp_store = localStorage.getItem('wallets');
	if(Array.isArray(JSON.parse(temp_store))){
		 return JSON.parse(temp_store);
		 }
else {
	return [];
}
	
};


function json_store(address, name, pool) {
		// Put the object into storage
		var old_wallets = get_store();
		if(Array.isArray(old_wallets)){
			//nothing
		} else {
			old_wallets = []
		}
		var data = { "address":address, "pool":pool, "name":name };
		old_wallets.push(data);
		localStorage.setItem('wallets', JSON.stringify(old_wallets));
	console.log("saved wallet:" + address);
};

function load_cards(){
	var wallets = get_store();
	wallets.forEach(function (item){
		var res = fetch_wallet(item.address, item);
		});
	
};

function fetch_bal(address){
	$.get("https://explorer.grlc-bakery.fun/ext/getbalance/" + address, function(res) {
		// console.log(res);
		var bal = localStorage.getItem('gwallet_bal_total');
		var con_bal = parseFloat(bal);
		var total = con_bal + parseFloat(res);
		total = round(total, 3);
		localStorage.setItem('gwallet_bal_total', total);
		document.getElementById("total_bal").innerHTML= localStorage.getItem('gwallet_bal_total');
	});
};

function total_bal(){
	var wallets = get_store();
	localStorage.setItem('gwallet_bal_total', 0)
	wallets.forEach(function (item){
		fetch_bal(item.address);
		});
};

function fetch_wallet(address, wallet){
	console.log(address);
	$.get("https://explorer.grlc-bakery.fun/ext/getaddress/" + address, function(res) {
		console.log(res);
		gen_row(res, wallet);
	});
};

// function rm_cards() {
// 	$("#cards").empty();
// };

// function update_vals(){
// 	var wallets = get_store();
// 	var addresses = [];
// if(wallets.length > 0){
// 	wallets.forEach(function (item){
// 		addresses.push(item.address);
// 		console.log(item.address);
// 	});
// 	localStorage.removeItem("wallets");
// 	addresses.forEach(function (adds){
// 		json_store(adds);
// 	});
// };
// };

// function get_listing(){
// 	$.get("http://api.cryptocoincharts.info/listCoins", function(res){
		
// 	});
// };

function gen_card(wallet){
	console.log("gen wallet");
	var card = '<div class="card mx-auto mb-3"><div class="card-body"><h5 id="saved-bal" class="card-title">'+ wallet.balance+' - GRLC</h5><p id="saved-wallet" class="card-text">'+wallet.address+'</p><a href="https://explorer.grlc-bakery.fun/address/'+wallet.address+'" id="saved-link" class="btn btn-primary">Go to Explorer</a></div></div>';

	$( "#cards" ).append(card);
};

function gen_row(res, wallet){
	console.log("gen row");
	var tx = res.last_txs;
	var sent = res.sent;
	var received = res.received;
var row = '<tr><td>'+wallet.name+'</td><td>'+wallet.pool+'</td><td>'+round(received, 3) +'/'+ round(sent, 1)+' - '+tx.length+'</td><td>'+round(res.balance, 4)+'</td></tr>';
	$( ".table" ).append(row);
};

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function gen_words(){
	var items = ["Sweet, sweet garlic....add more...", "Cloves on Cloves on Cloves", "To the Moon!!", "Is your Lambo pre-ordered yet?", "Is the still airdrop up!?...", "GPU = Garlic Production Unit"];
	var item = items[Math.floor(Math.random()*items.length)];
	document.getElementById("sub-text").innerHTML= item;
};