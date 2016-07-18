'use strict';

import cookies from 'js-cookie';
import Handlebars from 'handlebars';

import catalogItemTemplate from './hbs/catalog-item.hbs';
import wishlistItemTemplate from './hbs/wishlist-item.hbs';

export default (function App(window, document, $){
	console.log('run');

	const ozon = {
		partnerId: 'dnevnik_ru'
	}
	const cookieName = 'ozon_wishlist';

	let store = [];
	let wishlist = [];

	function getProducts(){
		$('.falsexml__item').each(function(){	
			const item = this;		
			const tables = item.querySelectorAll('.OzonRev_tbMax');
			
			const categoryId = item.getAttribute('id');

			[...tables].forEach( table => {
				let href = table.querySelector('.OzonRev_detailName');

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

				const product = {
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
				result += catalogItemTemplate(product);
			});

			return result;
		}
	}

	function catalog(){

		const $nav = $('.js-catalog-href');
		const $categories = $('.catalog__category');

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

		function init(){
			$nav.eq(0).addClass('active');
			$categories.not(':first').hide();
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

			const products = store.filter( product => (wishlist.indexOf(parseInt(product.id)) > -1) );
			
			products.forEach( product => {
				result += wishlistItemTemplate(product);	
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

			if (cookiesWishlist){
				const tempWishlist = cookiesWishlist.split(',').map(id => parseInt(id));

				//only ids wich are in store
				wishlist = store.filter( product => (tempWishlist.indexOf(parseInt(product.id)) > -1) )
								.map( product => parseInt(product.id));
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
