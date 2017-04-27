$(document).ready(function(){
	
	// // Javascript to enable link to tab
	// var url = document.location.toString();
	// if (url.match('#')) {
		// $('.nav-tabs a[href="#' + url.split('#')[1]).tab('show');
	// } //add a suffix
	
	// // Change hash for page-reload
	// $('.nav-tabs a').on('shown.bs.tab', function (e) {
		// window.location.hash = e.target.hash;
	// })
	
	Cart.init();
	
	$("#scrollCart").height(window.innerHeight - 157);
	
	$("#tab-contents").height(window.innerHeight - $("#tabs").innerHeight() - $("#hamburger").outerHeight(true) - 41);
	
	$('.itemsTab').each(function(i, obj) {
		$(this).height(window.innerHeight - $("#tabs").innerHeight() - $("#hamburger").outerHeight(true) - 41);
	});
	
	$('.product').matchHeight(false);
	
});

var Cart = {
	items:[],
	cartElement:null,
	init: function(){
		this.cartElement = $('#cart');
	},
	addItem: function(id, name, price){
		var item = this.getItem(id);
		if(item){
			item.quantity++;
		} else {
			this.items.push({
				id:id,
				name:name,
				price:price,
				quantity:1
			});
		}		
	},
	removeItem: function(id){
		var item = this.getItem(id);
		item.quantity--;
		if(item.quantity <= 0){
			this.items.splice(this.items.indexOf(item),1);
		}
	},
	getItem: function(id){
		for(var n=0; n<this.items.length; n++){
			if(this.items[n].id==id){
				return this.items[n];
			}
		}
		return false;
	},
	display: function(){
		var makeClickHandler = function(id){
			return function(){
				Cart.removeItem(id);
				Cart.display();
			}
		}	
		
		this.cartElement.empty();
		var total = 0;
		for(i in this.items){
			var row = $('<tr class="cartItem" title="Click to Decrement">').click(makeClickHandler(this.items[i].id));
			row.append(
				$('<td>').html(this.items[i].quantity + " &times; " + this.items[i].name),
				$('<td>').html("&pound;" + parseFloat(this.items[i].price * this.items[i].quantity / 100).toFixed(2))
			);
			this.cartElement.append(row);
			total+=(this.items[i].price * this.items[i].quantity);
		}
		$("#cartTotal").html("Total: &pound;" + parseFloat(total / 100).toFixed(2));
	},
	empty: function(){
		this.items = [];
	}
};

function addToCart(id){
	Cart.addItem(id, $("#" + id).data().name, $("#" + id).data().price);
	Cart.display();
}

function completeSale(){
	var data = new Object();
	data.cart=Cart.items
	data.paid=true;
	data.tab_name=null;
	$.post('sale', JSON.stringify(data), function(){location.reload();});
}

function toTab(){
	var tabName = "";
	while(tabName == ""){
		tabName = prompt("Please enter the tab name");
	}
	if(tabName == null){
		return "no tab name entered";
	}
	var data = new Object();
	data.cart=Cart.items
	data.paid=false;
	data.tab_name=tabName;
	$.post('sale', JSON.stringify(data), function(){location.reload();});
}