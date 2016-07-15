'use strict';

export default (function App(window, document, $){
	console.log('run');

	const ozon = {
		partnerId: 'dnevnik_ru'
	}

	let store = [];
	let wishlist = [];

	function getProducts(){
		$('.falsexml__item').each(function(){	
			var item = this;		
			var tables = item.querySelectorAll('.OzonRev_tbMax');
			var categoryProducts = [];
			var categoryId = item.getAttribute('id');
			var result = '';

			[...tables].slice(1).forEach( table => {
				var href = table.querySelector('.OzonRev_detailName');

				if (!href) {
					return;
				}
				
				var id = href.href.match(/id\/(\d+)\//)[1];
				var title = href.text;
				var link = href.getAttribute('href');
				var image = table.querySelector('.OzonRev_tdPic img').getAttribute('data-src');
				var text = table.querySelector('.OzonRev_detailAnnot').innerHTML;
				
				categoryProducts.push({id, categoryId, title, link, image, text});
			});

			store[categoryId] = categoryProducts;
		});

		console.log(store);
	}

	function renderProducts(){
		const $catalogCategories = $('.catalog__category');

		let category = ''; 
		
		$catalogCategories.each(function(){
			const categoryId = 'falsexml-' + this.getAttribute('id');
			this.innerHTML = generateList(store[categoryId]);
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

				result += '			<div class="catalog-item__text">';
				result += 				product.text;
				result += '			</div>';

				result += '			<div class="catalog-item__button-placeholder">';
				result += '				<button data-category-id="' + product.categoryId + '" data-product-id="' + product.id + '" class="button button--orange button--m js-add-to-list" target="_blank">';
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
		const $button = $('#js-wishlist-buy');

		$(document).on('click', '.js-add-to-list', function(e){
			e.preventDefault();

			const $this = $(this);
			const categoryId = $this.data('category-id');
			const productId = parseInt($this.data('product-id'));
			let result = '';

			if (wishlist.indexOf(productId) > -1){ // if already in list
				return;
			}

			const product = store[categoryId].filter(item => (parseInt(item.id) === productId) )[0];

			console.log(product);

			result += '<li class="wishlist__item wishlist-item">';			

			result += '		<div class="wishlist-item__image-placeholder">';
			result += '			<img class="wishlist-item__image" src="' + product.image + '" />';	
			result += '		</div>';
			
			result += '		<div class="wishlist-item__content">';

			result += '			<h3 class="wishlist-item__title">';	
			result += '				<a class="wishlist-item__link" href="' + product.link + '" target="_blank">';
			result += 					product.title;
			result += '				</a>';
			result += '			</h3>';

			// result += '			<div class="wishlist-item__text">';
			// result += 				product.text;
			// result += '			</div>';

			result += '		</div>';					
						
			result += '</li>'

			$list.append(result);

			wishlist.push(productId);

			updateBuyLink();

		});

		function updateBuyLink(){
			console.log(wishlist);
			if (wishlist.length > 0){
				$button.removeClass('hidden');
			}else{
				$button.addClass('hidden');
			}

			const href = 'http://www.OZON.ru/?context=cart&id=' + wishlist.join(',') +  '&partner=' + ozon.partnerId;

			$button.attr('href', href);
		}

		updateBuyLink();
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
