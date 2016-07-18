import cookies from 'js-cookie';

const Wishlist = (function(window, document, $){

	let cookieName = 'cookie';

	function setCookies(wishlist){
		if ( wishlist.length > 0){
			cookies.set(cookieName, wishlist.toString(), { expires: 100, path: ''});
		}else{
			cookies.set(cookieName, false, { expires: -1, path: ''});
		}			
	}

	function getCookies(){
		return cookies.get(cookieName);
	}

	function getWishlist(store){
		const cookiesWishlist = getCookies();

		if (!cookiesWishlist){
			return [];
		}
		
		const tempWishlist = cookiesWishlist.split(',').map(id => parseInt(id));

		//only ids wich are in store
		return store.filter( product => (tempWishlist.indexOf(parseInt(product.id)) > -1) )
							.map( product => parseInt(product.id));
	}

	function addProduct(wishlist, productId){
		if (wishlist.indexOf(productId) > -1){ // if already in list
			return wishlist;
		}
		
		wishlist.push(productId);
		
		setCookies(wishlist);

		return wishlist;
	}


	function deleteProduct(wishlist, productId){
		const index = wishlist.indexOf(productId);

		if (index > -1) {
			wishlist.splice(index, 1);			
			setCookies(wishlist);
		}
		return wishlist;
	}
	
	function init(options){
		cookieName = options.cookieName;
	}

	return{
		init,
		getWishlist,
		addProduct,
		deleteProduct,
	}

})(window, document, jQuery, undefined);

export default Wishlist;
