import Handlebars from 'handlebars';

import catalogCategoryTemplate from '../hbs/catalog-category.hbs';
import catalogItemTemplate from '../hbs/catalog-item.hbs';
import navigationItemTemplate from '../hbs/navigation-item.hbs';

const Render = (function(window, document, $){
	
	const $catalog = $('#catalog');
	const $navigation = $('#menu-list');

	let categories = [];

	let $navLinks;
	let $catalogCategories;

	let DOM = {};

	function renderCategory(store, wishlist, categoryId){			
		let result = '';
		const products = store.filter( product => (product.categories.indexOf(categoryId) > -1 ) );

		products.forEach( product => {
			result += catalogItemTemplate(product);
		});
		
		return result;
	}

	function renderCategories(store, wishlist){
		let catalog = '';
		let navigation = '';

		categories.forEach(function(category){			
			catalog += catalogCategoryTemplate({
				id: category.id,
				list: renderCategory(store, wishlist, category.id),
			});	

			navigation += navigationItemTemplate({
				id: category.id,
				title: category.title,
			});
		});

		$catalog.html(catalog);
		$navigation.html(navigation);

		DOM.catalogCategories = $catalog.find('.catalog__category');
		DOM.buyButtons = $catalog.find('.js-add-to-list');

		DOM.navLinks = $navigation.find('.js-catalog-href');
		
	}

	function renderButtons(wishlist){
		const buttonClass = 'catalog-item__button--added';

		DOM.buyButtons.attr('disabled', false);
		
		DOM.buyButtons.each(function(){
			const $this = $(this);		
			if (wishlist.indexOf(parseInt($this.data('product-id'))) > -1){
				$this.attr('disabled', true);
			}
		});
	}

	function navigate(categoryId){

		DOM.navLinks.removeClass('active')
				.filter('[href="#category-' + categoryId + '"]')
				.addClass('active');

		DOM.catalogCategories.hide()
							.filter('#category-' + categoryId)
							.show()
							.find('img[data-src]')
							.each(loadImages);
	}

	function loadImages(){
		const $this = $(this);
		const src = $this.attr('data-src');
		if (!src){
			return;
		}
		$this.attr('src', src);
	}

	function actions(){			
		DOM.navLinks.on('click', function(e){
			e.preventDefault();
			const categoryId = $(this).attr('href').replace('#category-', '');
			navigate(categoryId);
		});
	}	

	function renderProducts(store, wishlist){
		renderCategories(store, wishlist);
		actions();
		navigate(categories[0].id);
	}


	function init(options){
		categories = options.categories;
	}

	return{
		init,
		renderProducts,
		renderButtons,
	}

})(window, document, jQuery, undefined);

export default Render;
