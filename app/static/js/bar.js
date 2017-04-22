$(document).ready(function(){
    $("#tabs").children().first().addClass("active");
    $("#tab-contents").children().first().addClass("in active");
	
	Cart.init();
	
	$("#hamburger").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
		$("#hamburger").toggleClass("active");
	});
	
	$("#scrollCart").height(window.innerHeight - 98);
	$('.itemsTab').each(function(i, obj) {
		console.log(obj);
		$(this).height(window.innerHeight - 126);
	});
	
	$('.collapse').on('show.bs.collapse', function () {
		$('.collapse.in').collapse('hide');
	});
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
			var row = $('<tr title="Click to Decrement">').click(makeClickHandler(this.items[i].id));
			row.append(
				$('<td>').html(this.items[i].quantity + " &times; " + this.items[i].name),
				$('<td>').html("&pound;" + parseFloat(this.items[i].price * this.items[i].quantity / 100).toFixed(2))
			);
			this.cartElement.append(row);
			total+=(this.items[i].price * this.items[i].quantity);
		}
		$("#totalPrice").html("&pound;" + parseFloat(total / 100).toFixed(2));
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

function payTab(tabName){
	var c = confirm("Pay off tab: " + tabName + "?");
	if(c){
		var data = new Object();
		data.tabName = tabName;
		$.post('paytab', JSON.stringify(data), function(){location.reload();});
	} else {
		return "canceled";
	}
}