const Products = (function(window, document, $){

	function getFalseXML(){
		
		let products = [];

		$('.falsexml__item').each(function(){	
			const item = this;		
			const tables = item.querySelectorAll('.OzonRev_tbMax');
			
			const categoryId = parseInt(item.getAttribute('data-category-id'));

			[...tables].forEach( table => {
				let href = table.querySelector('.OzonRev_detailName');

				if (!href) {
					return;
				}
				//update if item alredy exists
				const id = href.href.match(/id\/(\d+)\//)[1];
				const existingProduct = products.filter( product => (product.id == id) );
				
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
				products.push(product);				
			});

		});

		console.log(products);
		return products;
	}


	return{
		getFalseXML
	}

})(window, document, jQuery, undefined);

export default Products;
