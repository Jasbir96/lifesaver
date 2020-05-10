// For sticky navigation
$(document).ready(function(){
 $('.js--section-features').waypoint(function(direction){
   if(direction=="down"){
     $('nav').addClass('sticky');
   }else{
    $('nav').removeClass('sticky');
   }
 },{
  offset:'60px;'
});
// Scroll on buttons
//Ye js se karna hai   
//1000 is millisecond
$('.js--scroll-to-plans').click(function(){
  $('html,body').animate({scrollTop: $('.js--section-plans').offset().top},1000);
});
$('.js--scroll-to-start').click(function(){
  $('html,body').animate({scrollTop: $('.js--section-features').offset().top},500);
});
//Navigation scroll
$('a[href*="#"]').on('click', function (e) {
	e.preventDefault();

	$('html, body').animate({
		scrollTop: $($(this).attr('href')).offset().top
	}, 500, 'linear');
}); 
// Animation on scroll
$('.js--wp-1').waypoint(function(direction){
  $('.js--wp-1').addClass('animated fadeIn');
},{
  offset:'50%'
});
$('.js--wp-2').waypoint(function(direction){
  $('.js--wp-2').addClass('animated fadeInUp');
},{
  offset:'50%'
});
$('.js--wp-3').waypoint(function(direction){
  $('.js--wp-3').addClass('animated fadeIn');
},{
  offset:'50%'
});
$('.js--wp-4').waypoint(function(direction){
  $('.js--wp-4').addClass('animated fadeIn');
},{
  offset:'50%'
});
// Mobile Nav
$('.js--nav-icon').click(function(){
  var nav= $('.js--main-nav');
  nav.slideToggle(200);
})
});
 
