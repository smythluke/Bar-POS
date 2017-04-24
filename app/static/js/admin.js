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
	
	$(".editCategoryRow").on("focusout", function(){
		row = $(this);
		operation = "edit";
		id = row.data("categoryid");
		name = row.children()[0].innerText.trim();
		weight = row.children()[1].innerText.trim();
		editCategory(operation, id, name, weight);
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
	
	$(".editItemRowTd").on("focusout", function(){
		row = $(this).parents(".editItemRow");
		operation = "edit";
		id = row.data("itemid");
		name = row.children()[0].innerText.trim();
		price = row.children()[1].innerText.trim() * 100;
		category = row.find("select")[0].value;
		on_sale = row.find("input")[0].checked;
		editItem(operation, id, name, price, category, on_sale);
	});
	
	$(".editItemRowFormInput").on("change", function(){
		row = $(this).parents(".editItemRow");
		operation = "edit";
		id = row.data("itemid");
		name = row.children()[0].innerText.trim();
		price = row.children()[1].innerText.trim() * 100;
		category = row.find("select")[0].value;
		on_sale = row.find("input")[0].checked;
		editItem(operation, id, name, price, category, on_sale);
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

function editItem(operation, id, name, price, category, on_sale){
	if(operation == "delete"){
		var c = confirm("Delete item " + name + "?\nWARNING: All sales associated with this item will be deleted!");
		if(c){
			var data = new Object;
			data.operation = operation;
			data.id = id;
			data.name = name;
			data.price = price;
			data.category = category;
			data.on_sale = on_sale;
			$.post('edititem', JSON.stringify(data), function(){location.reload();});
		}
	} else {
		var data = new Object;
		data.operation = operation;
		data.id = id;
		data.name = name;
		data.price = price;
		data.category = category;
		data.on_sale = on_sale;
		$.post('edititem', JSON.stringify(data), function(){console.log("updated: " + JSON.stringify(data));}).fail(function(){location.reload();});
	}
}

function addCategory(event, b){
	if(! b.hasClass("disabled")){
		var data = new Object();;
		data.name = $("#addCategoryName").val();
		$.post('addcategory', JSON.stringify(data), function(){location.reload();});
	}
	event.preventDefault();
}

function editCategory(operation, id, name, weight){
	if(operation == "delete"){
		var c = confirm("Delete category " + name + "?\nWARNING: All items in this category will be deleted and all sales associated with those items will be deleted!");
		if(c){
			var data = new Object;
			data.operation = operation;
			data.id = id;
			data.name = name;
			data.weight = weight;
			$.post('editcategory', JSON.stringify(data), function(){location.reload();});
		}
	} else {
		var data = new Object;
		data.operation = operation;
		data.id = id;
		data.name = name;
		data.weight = weight;
		$.post('editcategory', JSON.stringify(data), function(){console.log("updated: " + JSON.stringify(data));}).fail(function(){location.reload();});
	}
}