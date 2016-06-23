'use strict';

export default (function App(window, document, $){
	console.log('run');

	var maxHeight = 650;
	var maxWidth = 1020;

	var isMobile = (function() { 
		if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		){
			return true;
		} else {
			return false;
		}
	})();

	function scrollMeTo(){

		
		const $header = $('#header');
		
		$('.js-goto').on('click', function(e){
			const paddingTop = $(window).width() > maxWidth ? $header.outerHeight() : 0;
			const $target = $(this.href.replace( /^.*\#/, '#' ) );
			
			if ($target.length === 1) {
				e.preventDefault();

				$('body,html').animate({ 
					scrollTop: $target.offset().top - paddingTop,
					easing: 'ease-in'
				}, 500);
			};
		});

	};

	function header(){
		const $header = $('header');


		function fix(){
			const scrollTop = $(window).scrollTop();
			const showPosition = 200;

			if ( scrollTop > 0 && scrollTop <= showPosition ){
				$header.addClass('header--hidden');
				$header.removeClass('header--scrolled');
			}else if ( scrollTop > showPosition ){
				$header.addClass('header--scrolled');
				$header.removeClass('header--hidden');
			}else{
				$header.removeClass('header--scrolled');
				$header.removeClass('header--hidden');
			}
		}
		fix();

		$(document).on('scroll', fix);
	}


	function menu(){
		var $menuHrefs = $('.menu__href');
		var $sections = $('.section');

		var winHeight = ( window.innerHeight || document.documentElement.clientHeight );

		function setActive(){						
			$sections.each(function(index, section){				
				var sectionId = $(this).attr('id');
				var rect = this.getBoundingClientRect();
				var rectTop = Math.round(rect.top);
				var rectBottom = Math.round(rect.bottom);

				if (rectTop <= 50 && rectBottom / 2 <= winHeight ){
					$menuHrefs.removeClass('active');
					$menuHrefs.filter('[href="#' + sectionId + '"]').addClass('active');
				}
			});
		}
		setActive();

		$(window).on('scroll', function(e){
			setActive();
		});

		$(window).on('resize', function(e){
			winHeight = ( window.innerHeight || document.documentElement.clientHeight );			
			setActive();
		});

	}

	/*
		submit form
	*/

	function form(){		

		$.extend($.validator.messages, {
			required: 'Это поле обязательно для заполнения.',
			remote: 'Please fix this field.',
			email: 'Введите корректный e-mail адрес.',
			url: 'Please enter a valid URL.',
			date: 'Please enter a valid date.',
			dateISO: 'Please enter a valid date (ISO).',
			number: 'Введите число.',
			digits: 'Допустимо вводить только цифры.',
			creditcard: 'Please enter a valid credit card number.',
			equalTo: 'Please enter the same value again.',
			accept: 'Please enter a value with a valid extension.',
			maxlength: jQuery.validator.format('Please enter no more than {0} characters.'),
			minlength: jQuery.validator.format('Please enter at least {0} characters.'),
			rangelength: jQuery.validator.format('Please enter a value between {0} and {1} characters long.'),
			range: jQuery.validator.format('Please enter a value between {0} and {1}.'),
			max: jQuery.validator.format('Please enter a value less than or equal to {0}.'),
			min: jQuery.validator.format('Please enter a value greater than or equal to {0}.')
		});

		$('form').each( function(){

			const $form = $(this);
			const $button = $form.find('button[type="submit"]');
			const $success = $form.find('.order-form__success');
			
			$success.hide();

			$form.validate({
			});

			$form.on('submit', function(e){

				e.preventDefault();

				const form = e.target;

				if ( !$(form).valid() ){
					return false;
				}

				$button.text('Отправка данных...');
				$button.attr('disabled', true);

				$.ajax({
					url: $form.attr('action'), 
				    method: 'POST',
				    data: $form.serialize(),
				    dataType: 'json',
				    success: function( response ) {
				    	console.log(response);
						$success.html('Спасибо! Ваша заявка была успешно отправлена!');
						$success.removeClass('order-form__success--error');	
				    },
				    error: function(xhr, ajaxOptions, error){
				    	console.log('Data could not be saved.' + error.message);
						$success.addClass('order-form__success--error');
						$success.html('Ошибка сохранения данных, попробуйте еще раз. Если ошибка повторится - свяжитесь с нами.');

				    },
				    complete: function(){					    	
				    	$success.show();
						$button.attr('disabled', false).text('Отправить заявку');			    	
				    }
				});				
				
				

			});
		});

	}

	function init(){

		if (!isMobile){
			header();
		}

		scrollMeTo();
		menu();
		form();
	}

	return {
		init 
	}

})(window, document, jQuery, undefined);
