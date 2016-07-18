'use strict';

import Products from './components/products';
import Wishlist from './components/wishlist';
import RenderCatalog from './components/render-catalog';
import RenderWishlist from './components/render-wishlist';

export default (function App(window, document, $){
	console.log('run');

	const $loader = $('#loader');

	let store = [];
	let wishlist = [];

	function getProducts(){
		store = Products.getFalseXML();
	}

	function getWishlist(){
		wishlist = Wishlist.getWishlist(store);
	}

	function addProduct(productId){
		wishlist = Wishlist.addProduct(wishlist, productId);
		renderWishlist();
	}

	function deleteProduct(productId){
		wishlist = Wishlist.deleteProduct(wishlist, productId);
		renderWishlist();
	}

	function renderProducts(){
		RenderCatalog.renderProducts(store, wishlist);
	}

	function renderWishlist(){
		console.log(store);
		RenderWishlist.render(store, wishlist);
		RenderCatalog.renderButtons(wishlist);
	}


	function actions(){

		$(document).on('click', '.js-wishlist-delete', function(e){
			e.preventDefault();
			const productId = parseInt($(this).data('product-id'));
			deleteProduct(productId);
		});

		$(document).on('click', '.js-add-to-list', function(e){
			e.preventDefault();
			const productId = parseInt($(this).data('product-id'));
			addProduct(productId);
		});
	}

	function init(){

		Wishlist.init({
			cookieName: 'ozon_wishlist',
		});

		const categories = [
			{ id: 1, title: 'Ранцы и рюкзаки'},
			{ id: 2, title: 'Сумки для обуви'},
			{ id: 3, title: 'Канцелярские товары'},
			{ id: 4, title: 'Дневники'},
			{ id: 5, title: 'Пеналы'},
			{ id: 6, title: 'Папки и портфели'},
			{ id: 7, title: 'Хобби и творчество'},
			{ id: 8, title: 'Планшеты'},
			{ id: 9, title: 'Игрушки'},
		];

		RenderCatalog.init({	
			categories: categories,
		});

		RenderWishlist.init({	
			partnerId: 'dnevnik_ru',
		});

		getProducts();
		getWishlist();
		renderProducts();
		renderWishlist();
		actions();

		$loader.hide();
	}

	return {
		init 
	}

})(window, document, jQuery, undefined);
