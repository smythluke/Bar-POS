$(document).ready(function(){
	$('.collapse').on('show.bs.collapse', function () {
		$('.collapse.in').collapse('hide');
	});
	$("#tabsTable").height(window.innerHeight - $("#hamburger").outerHeight(true));
});

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