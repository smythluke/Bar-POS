$(document).ready(function(){
	$("#hamburger").click(function(e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
		$("#hamburger").toggleClass("active");
	});
});