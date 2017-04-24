$(document).ready(function(){
	$("#tabs").children().first().addClass("active");
    $("#tab-contents").children().first().addClass("in active");
	
	$('.contentTab').each(function(i, obj) {
		$(this).height(window.innerHeight - 126);
	});
});

function getSales(event, b){
	if(! b.hasClass("disabled")){
		fromDate = $("#fromDate").val();
		toDate = $("#toDate").val();
		location.href=("/sales/" + fromDate + "/" + toDate);
	}
	event.preventDefault();
}