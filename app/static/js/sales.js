$(document).ready(function(){
	$("#tabs").children().first().addClass("active");
    $("#tab-contents").children().first().addClass("in active");
	
	$('.contentTab').each(function(i, obj) {
		$(this).height(window.innerHeight - 126);
	});
	var date = new Date();
	var year = date.getFullYear();
	var month = (date.getMonth() > 9) ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
	var day = (date.getDate() > 9) ? (date.getDate()) : ("0" + date.getDate());
	$("#toDate").val(year + "-" + month + "-" + day)
	date.setMonth(date.getMonth() - 1);
	date.setDate(date.getDate() + 1);
	var year = date.getFullYear();
	var month = (date.getMonth() > 9) ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1));
	var day = (date.getDate() > 9) ? (date.getDate()) : ("0" + date.getDate());
	$("#fromDate").val(year + "-" + month + "-" + day)
	$("#getSalesButton").removeClass("disabled");
});

function getSales(event, b){
	if(! b.hasClass("disabled")){
		fromDate = $("#fromDate").val();
		toDate = $("#toDate").val();
		location.href=("/sales/" + fromDate + "/" + toDate);
	}
	event.preventDefault();
}