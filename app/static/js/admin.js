$(document).ready(function(){
	$("#tabs").children().first().addClass("active");
    $("#tab-contents").children().first().addClass("in active");
	
	// Javascript to enable link to tab
	var url = document.location.toString();
	if (url.match('#')) {
		$('.nav-tabs a[href="#' + url.split('#')[1]).tab('show');
	} //add a suffix
	
	// Change hash for page-reload
	$('.nav-tabs a').on('shown.bs.tab', function (e) {
		window.location.hash = e.target.hash;
	})
	
	$('.contentTab').each(function(i, obj) {
		$(this).height(window.innerHeight - 126);
	});
	
	$('#editCategoryTable').DataTable({
        "paging": false,
		"searching": false,
		"columns": [
			null,
			null,
			{ "orderable": false }
		]
	});
	
	$(".editCategoryNameTd, .editCategoryWeightTd").on({
		"focusout" : function(){
			row = $(this).parents(".editCategoryRow");
			editCategory("edit", row);
		},
		"keypress" : function(e){
			if(e.which == 13){
				e.preventDefault();
				row = $(this).parents(".editCategoryRow");
				editCategory("edit", row);
			}
		}
	});
	
	$(".editCategoryWeightTd").on({
		"keypress" : function(e){
			if(!(e.which >= 48 && e.which <= 57)){//48-57 are numbers
				e.preventDefault();
			}
		}
	});
	
	$('#editItemTable').DataTable({
        "paging": false,
		"autoWidth": false,
		"columns": [
			null,
			null,
			{ "searchable": false, "orderable": false },
			{ "visible": false },
			null,
			{ "orderable": false }
		]
	});
	
	$(".editItemNameTd, .editItemPriceTd").on({
		"focusout" : function(){
			row = $(this).parents(".editItemRow");
			editItem("edit", row);
		},
		"keypress" : function(e){
			if(e.which == 13){
				e.preventDefault();
				row = $(this).parents(".editItemRow");
				editItem("edit", row);
			}
		}
	});
	
	$(".editItemPriceTd").on({
		"keypress" : function(e){
			if(!((e.which >= 48 && e.which <= 57) || (e.which == 46))){//48-57 46 is decimal 13 is enter
				e.preventDefault();
			}
		}
	});
	
	$(".editItemRowFormInput").on({
		"change" : function(){
			row = $(this).parents(".editItemRow");
			editItem("edit", row);
		}
	});
});



function addItem(event, b){
	if(! b.hasClass("disabled")){
		var data = new Object();;
		data.name = $("#addItemName").val();
		data.price = $("#addItemPrice").val();
		data.category = $("#addItemCategory").val();
		$.post('additem', JSON.stringify(data), function(){location.reload();});
	}
	event.preventDefault();
}

function editItem(operation, row){
	price = row.children()[1].innerText.split(".");
	price = price.shift() + (price.length ? '.' : '') + price.join('');
	var data = new Object;
	data.operation = operation;
	data.id = row.data("itemid");
	data.name = row.children()[0].innerText.trim();
	data.price = price * 100;
	data.category = row.find("select")[0].value;
	data.on_sale = row.find("input")[0].checked;
	if(operation == "delete"){
		var c = confirm("Delete item " + data.name + "?\nWARNING: All sales associated with this item will be deleted!");
		if(c){
			$.post('edititem', JSON.stringify(data), function(){location.reload();});
		}
	} else {
		$.post('edititem', JSON.stringify(data), function(){console.log("updated: " + JSON.stringify(data));}).fail(function(){location.reload();});
	}
}

function addCategory(event, b){
	if(! b.hasClass("disabled")){
		var data = new Object();;
		data.name = $("#addCategoryName").val();
		$.post('addcategory', JSON.stringify(data), function(){location.reload();}).fail(function(){location.reload();});
	}
	event.preventDefault();
}

var obj;

function editCategory(operation, row){
	obj = row;
	var data = new Object();
	data.operation = operation;
	data.id = row.data("categoryid");
	data.name = row.children()[0].innerText.trim();
	data.weight = row.children()[1].innerText.trim();
	if(operation == "delete"){
		var c = confirm("Delete category " + data.name + "?\nWARNING: All items in this category will be deleted and all sales associated with those items will be deleted!");
		if(c){
			$.post('editcategory', JSON.stringify(data), function(){location.reload();});
		}
	} else {
		$.post('editcategory', JSON.stringify(data), function(){console.log("updated: " + JSON.stringify(data));}).fail(function(){location.reload();});
	}
}