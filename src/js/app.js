'use strict';

import cookies from 'js-cookie';

export default (function App(window, document, $){
	console.log('run');

	const ozon = {
		partnerId: 'dnevnik_ru'
	}

	let store = [];
	let wishlist = [];

	const cookieName = 'ozon_wishlist';

	function getProducts(){
		$('.falsexml__item').each(function(){	
			var item = this;		
			var tables = item.querySelectorAll('.OzonRev_tbMax');
			var categoryProducts = [];
			var categoryId = item.getAttribute('id');
			var product = {};

			[...tables].slice(1).forEach( table => {
				var href = table.querySelector('.OzonRev_detailName');

				if (!href) {
					return;
				}
				//update if item alredy exists
				const id = href.href.match(/id\/(\d+)\//)[1];
				const existingProduct = store.filter( product => (product.id == id) );
				if (existingProduct.length > 0){
					existingProduct[0].categories.push(categoryId);
					return;
				}

				product = {
					id: id,
					categories: [categoryId],
					title: href.text,
					link: href.getAttribute('href'),
					image: table.querySelector('.OzonRev_tdPic img').getAttribute('data-src'),
					text: table.querySelector('.OzonRev_detailAnnot').innerHTML,
					price: table.querySelector('.OzonRev_priceValue > b').innerHTML,
					currency: table.querySelector('.OzonRev_priceCurrency').innerHTML,

				}
				store.push(product);				
			});

		});

		console.log(store);
	}

	function renderProducts(){
		const $catalogCategories = $('.catalog__category');
		const $loader = $('#loader');

		let category = ''; 
		
		$catalogCategories.each(function(){
			const categoryId = 'falsexml-' + this.getAttribute('id');
			const products = store.filter( product => (product.categories.indexOf(categoryId) > -1 ) );
			this.innerHTML = generateList(products);
			$loader.hide();
		});

		function generateList(products){
			let result = '';

			products.forEach( product => {
				result += '<div class="catalog__item catalog-item">';
				
				result += '		<div class="catalog-item__image-placeholder">';
				result += '			<img class="catalog-item__image" data-src="' + product.image + '" />';	
				result += '		</div>';
				
				result += '		<div class="catalog-item__content">';

				result += '			<h3 class="catalog-item__title">';	
				result += '				<a class="catalog-item__link" href="' + product.link + '" target="_blank">';
				result += 					product.title;
				result += '				</a>';
				result += '			</h3>';

				result += '			<div class="catalog-item__price">';
				result += 				'Цена: ' + product.price + ' ' + product.currency ;
				result += '			</div>';

				result += '			<div class="catalog-item__text">';
				result += 				product.text;
				result += '			</div>';

				result += '			<div class="catalog-item__button-placeholder">';
				result += '				<button data-product-id="' + product.id + '" class="button button--orange button--m js-add-to-list" target="_blank">';
				result += '					Купить';
				result += '				</button>';
				result += '			</div>';

				result += '		</div>';

				result += '</div>';
			});

			return result;
		}
	}

	function catalog(){

		const $nav = $('.js-catalog-href');
		const $categories = $('.catalog__category');

		function init(){
			$nav.eq(0).addClass('active');
			$categories.not(':first').hide();
		}

		function navigate($navLink){
			const target = $navLink.attr('href').substr(0);
			const $targetCategory = $categories.filter(target);
			const $images = $targetCategory.find('img[data-src]');

			$nav.removeClass('active');
			$navLink.addClass('active');

			$categories.hide();
			$targetCategory.show();

			$images.each(function(){
				const $this = $(this);
				const src = $this.attr('data-src');
				$this.attr('src', src);
			});	
		}

		$nav.on('click', function(e){
			e.preventDefault();
			navigate($(this));
		});

		init();
		navigate($nav.eq(0));
		
	}

	function list(){

		const $list = $('#wishlist-list');
		const $totalPrice = $('#wishlist-total-price');
		const $button = $('#js-wishlist-buy');

		function updateList(){
			
			let result = '';
			let totalPrice = 0;
			let currency = 0;

			console.log(store.length);
			console.log(wishlist);
			const products = store.filter( product => (wishlist.indexOf(parseInt(product.id)) > -1) );
			
			console.log(products);

			products.forEach( product => {

				result += '<li class="wishlist__item wishlist-item">';			

				result += '		<div class="wishlist-item__image-placeholder">';
				result += '			<img class="wishlist-item__image" src="' + product.image + '" />';	
				result += '		</div>';		
				
				result += '		<div class="wishlist-item__content">';

				result += '			<button class="wishlist-item__delete js-wishlist-delete" data-product-id="' + product.id + '">&times;</button>';	

				result += '			<h3 class="wishlist-item__title">';	
				result += '				<a class="wishlist-item__link" href="' + product.link + '" target="_blank">';
				result += 					product.title;
				result += '				</a>';
				result += '			</h3>';

				result += '			<div class="wishlist-item__price">';
				result += 				'Цена: ' + product.price + ' ' + product.currency ;
				result += '			</div>';

				result += '		</div>';					
							
				result += '</li>';

				totalPrice += parseInt(product.price);
				currency = product.currency;

			});

			$list.html(result);
			$totalPrice.html('Общая сумма: ' + totalPrice + ' ' + currency);
			updateBuyLink();

			if (products.length > 0){
				$button.removeClass('hidden');
				$totalPrice.removeClass('hidden');
			}else{
				$button.addClass('hidden');
				$totalPrice.addClass('hidden');
			}

			
		}

		function setCookies(){
			if ( wishlist.length > 0){
				cookies.set(cookieName, wishlist.toString(), { expires: 100, path: ''});
			}else{
				cookies.set(cookieName, false, { expires: -1, path: ''});
			}			
		}

		function getCookies(){
			return cookies.get(cookieName);
		}

		function updateBuyLink(){
			console.log(wishlist);

			const href = 'http://www.OZON.ru/?context=cart&id=' + wishlist.join(',') +  '&partner=' + ozon.partnerId;

			$button.attr('href', href);
		}

		function init(){
			const cookiesWishlist = getCookies();
			let tempWishlist
			if (cookiesWishlist){
				tempWishlist = cookiesWishlist.split(',').map(id => parseInt(id));

				//only ids wich are in store
				wishlist = store.filter( product => (tempWishlist.indexOf(parseInt(product.id)) > -1) ).map( product => parseInt(product.id));
			}
			updateList();
		}
		init();


		$(document).on('click', '.js-wishlist-delete', function(e){
			e.preventDefault();
			const productId = $(this).data('product-id');
			const index = wishlist.indexOf(productId);
			if (index > -1) {
				wishlist.splice(index, 1);
			}
			updateList();
			setCookies();
		});

		$(document).on('click', '.js-add-to-list', function(e){
			e.preventDefault();

			const $this = $(this);

			const productId = parseInt($this.data('product-id'));
			
			if (wishlist.indexOf(productId) > -1){ // if already in list
				return;
			}
			
			wishlist.push(productId);

			updateList();
			setCookies();

		});

	}

	function init(){
		getProducts();
		renderProducts();
		catalog();
		list();
	}

	return {
		init 
	}

})(window, document, jQuery, undefined);
