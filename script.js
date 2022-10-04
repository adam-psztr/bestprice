function getServerData(url){
	let fetchOptions = {
		method: "GET",
		mode: "cors",
		cache: "no-cache"
	};

	return fetch(url, fetchOptions).then(
		response => response.json(),
		err => console.error(err)
	)
}

function startGetPrice() {
	getServerData("https://adam-psztr.github.io/bestPrice.src/products.json").then(
		data => saveServerData(data)
	);
}
	
function saveServerData(data) {
	querydata = data.queries;
	showProductPrice();
}

function showProductPrice() {

	document.querySelector("main").innerHTML = "";

	productsList = querydata.sortArray[productsListSortData];

	let queryDate;
	
	let mainProductName, subProductName, productSeller = [], productName = [], productPrice = [], productLink = [];
	
	for(let i=0; i<productsList.length; i++) {
		productsListItem = productsList[i];
		queryDate = new Date(querydata[productsListItem].queryDate).toLocaleDateString("hu-HU") + " (" + new Date(querydata[productsListItem].queryDate).toLocaleTimeString("hu-HU") + ")";
		mainProductName = querydata[productsListItem].mainProductName;
		subProductName = querydata[productsListItem].subProductName;
		productSeller = [], productName = [], productPrice = [], productLink = [];
		
		for(let j=0; j<querydata[productsList[i]].productSellers.length; j++) {
			if(!querydata[productsListItem].productSellers[j] ||
				querydata[productsList[i]].productSellers[j].productSeller == "X" ||
				querydata[productsList[i]].productSellers[j].productName == "X" ||
				querydata[productsList[i]].productSellers[j].productPrice == "0") {
				continue;
			};
			productSeller.push(querydata[productsList[i]].productSellers[j].productSeller);
			productName.push(querydata[productsList[i]].productSellers[j].productName);
			productPrice.push(querydata[productsList[i]].productSellers[j].productPrice);
			productLink.push(querydata[productsList[i]].productSellers[j].productLink);
		};

		if (filter(mainProductName)) {
			makeProductPriceElement(queryDate, productsListItem, mainProductName, subProductName, productSeller, productName, productPrice, productLink);
		}
	}
}

function filter(mainProductName) {
	let input = searchInput.value.toLowerCase();
	return !(mainProductName.toLowerCase().indexOf(input) == -1);
}

function makeProductPriceElement(queryDate, productsListItem, mainProductName, subProductName, productSeller, productName, productPrice, productLink) {
	
	let bestPrice = Math.min(...productPrice).toLocaleString('hu-HU');

	if(bestPrice == 0) {
		return
	};

	let sampleHeader = `<article class="bestPrice">
		<header>
		<div class="productPic">
		<img src="https://via.placeholder.com/200x200.png?text=${productsListItem}" alt="${productsListItem}">
		</div>
		<span class="separator"></span>
		<div class="productName">
		<h2>${mainProductName}</h2>
		<h3>${subProductName}</h3>
		</div>
		<span class="separator"></span>
		<div class="productMinPrice">
		<h2>${bestPrice} Ft</h2>
		<h5>${queryDate}</h5>
		</div>
		</header>
		</article>
		<article class="sellerBox">
		<div class="wrapper">
		<div class="radius">
		<div class="innerRadius radLeft"></div>
		</div>
		<article class="sellers">`;

	let sampleSellers = "";

	for(let k=0; k<productSeller.length; k++) {
		let sampleSeller = `
			<section class="seller">
			<div class="sellerLogo">
			<img src="https://via.placeholder.com/50x50.png?text=${productSeller[k]}" alt="${productSeller[k]} logo">
			</div>
			<div class="sellerProductName">
			<h4>${productName[k]}</h4>
			</div>
			<div class="sellerProductPrice">
			<h3>${parseInt(productPrice[k]).toLocaleString('hu-HU')} Ft</h3>
			</div>
			<div class="goPageLink">
			<a href="${productLink[k]}" target="_blank">
			<span class="material-symbols-outlined">double_arrow</span>
			</a>
			</div>
			</section>`;
		sampleSellers += sampleSeller;
	};

	let sampleSellerEnd = `
		</article>
		<div class="radius">
		<div class="innerRadius radRight"></div>
		</div>
		</div>
		</article>`;
	
	document.querySelector("main").innerHTML += sampleHeader + sampleSellers + sampleSellerEnd;
	
	mainFunctions()
}

function mainFunctions() {
	let open = false
	
	// document.querySelectorAll("main > article.bestPrice").forEach((el)=> el.addEventListener('click',()=>{
	// 	open ? document.querySelector("main article.sellerBox").style.height = "0" : document.querySelector("main article.sellerBox").style.height = document.querySelector("main article.sellerBox .wrapper").clientHeight + document.querySelector("main article.sellerBox .chartBox").clientHeight + "px";
	// 	open = !open;
	// }))

	document.querySelectorAll("main > article.bestPrice").forEach((el)=> el.addEventListener('click',()=>{
		open ? document.querySelector("main article.sellerBox").style.height = "0" : document.querySelector("main article.sellerBox").style.height = document.querySelector("main article.sellerBox .wrapper").clientHeight + "px";
		open = !open;
	}))
	
}

let querydata;

let productsListSortBy = ["ascendingByPrice", "descendingByPrice", "ascendingAccordingToAbc", "descendingAccordingToAbc"];
let productsListSortData = productsListSortBy[1];
let productsList = [];

let searchInput = document.querySelector("#search");

searchInput.addEventListener('keyup', () => {
	showProductPrice();
});

startGetPrice();