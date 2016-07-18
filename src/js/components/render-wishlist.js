import Handlebars from 'handlebars';

import wishlistItemTemplate from '../hbs/wishlist-item.hbs';

const RenderWishlist = (function(window, document, $){

	const $list = $('#wishlist-list');
	const $totalPrice = $('#wishlist-total-price');
	const $button = $('#js-wishlist-buy');

	let partnerId;
		
	function render(store, wishlist){
		console.log(wishlist);
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

		updateBuyLink(wishlist);

		if (products.length > 0){
			showList()
		}else{
			hideList();
		}
	}	

	function updateBuyLink(wishlist){
		console.log(wishlist);

		const href = 'http://www.OZON.ru/?context=cart&id=' + wishlist.join(',') +  '&partner=' + partnerId;

		$button.attr('href', href);
	}

	function showList(){
		$button.removeClass('hidden');
		$totalPrice.removeClass('hidden');
	}	

	function hideList(){
		$button.addClass('hidden');
		$totalPrice.addClass('hidden');
	}	

	function init(options){
		partnerId = options.partnerId;
	}
	
	return{
		init,
		render,
	}

})(window, document, jQuery, undefined);

export default RenderWishlist;
