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
	querydata = data.queries[0];
	showProductPrice();
}

function showProductPrice() {

	document.querySelector("main").innerHTML = "";

	let mainProductName, subProductName, productSeller = [], productName = [], productPrice = [], productLink = [];
	
	for(let i=0; i<productsList.length; i++) {
		productsListItem = productsList[i];
		mainProductName = querydata[productsListItem].productName;
		// subProductName = querydata[productsListItem].subProductName;
		subProductName = "proba";
		productSeller = [], productName = [], productPrice = [], productLink = [];

		for(let j=0; j<querydata[productsList[i]].productSellers.length; j++) {
			productSeller.push(querydata[productsList[i]].productSellers[j].productSeller);
			productName.push(querydata[productsList[i]].productSellers[j].productName);
			productPrice.push(querydata[productsList[i]].productSellers[j].productPrice);
			productLink.push(querydata[productsList[i]].productSellers[j].productLink);
		};

		if (filter(mainProductName)) {
			makeProductPriceElement(productsListItem, mainProductName, subProductName, productSeller, productName, productPrice, productLink);
		}
	}
}

function makeProductPriceElement(productsListItem, mainProductName, subProductName, productSeller, productName, productPrice, productLink) {
	
	let bestPrice = Math.min(...productPrice).toLocaleString('hu-HU');

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
			<img src="https://via.placeholder.com/50x50.png?text=${productSeller[k]}" alt="">
			</div>
			<div class="sellerProductName">
			<h4>${productName[k]}</h4>
			</div>
			<div class="sellerProductPrice">
			<h3>${parseInt(productPrice[k]).toLocaleString('hu-HU')}Ft</h3>
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

	let sampleChart = `
		<article class="chartBox">
		<section class="query">
		<div class="topLine">
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		</div>
		<div class="bottomLine">
		<div class="queryDate">
		<p>22.06.01</p>
		</div>
		</div>
		</section>
		<section class="query">
		<div class="topLine">
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		<div class="chart">
		<img src="https://via.placeholder.com/50/0000FF/808080?Text=Sellet Logo" alt="">
		</div>
		</div>
		<div class="bottomLine">
		<div class="queryDate">
		<p>22.06.01</p>
		</div>
		</div>
		</section>
		</article>`;
	
	document.querySelector("main").innerHTML += sampleHeader + sampleSellers + sampleSellerEnd;
	
	mainFunctions()
}


// function proba(data){
// 	querydata = data.queries;
// 	document.querySelector("#p1").innerText = querydata[0]["iphone-14-pro"]["productSellers"][1]["productSeller"];
// 	document.querySelector("#p2").innerText = querydata[0]["iphone-14-pro"]["productSellers"][1]["productName"];
// 	document.querySelector("#p3").innerText = querydata[0]["iphone-14-pro"]["productSellers"][1]["productPrice"];
// }

// date = date.toLocaleDateString("hu", {
// 	day: "numeric",
// 	month: "short",
// 	year: "numeric"
// });

// const date = new Date();
// const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
// const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];


// var date      = new Date();
// var timestamp = date.getTime();

function mainFunctions() {
	let open = false
	
	document.querySelectorAll("main > article.bestPrice").forEach((el)=> el.addEventListener('click',()=>{
		open ? document.querySelector("main article.sellerBox").style.height = "0" : document.querySelector("main article.sellerBox").style.height = document.querySelector("main article.sellerBox .wrapper").clientHeight + document.querySelector("main article.sellerBox .chartBox").clientHeight + "px";
		open = !open;
	}))
	
}

function filter(mainProductName) {
	let input = document.querySelector("#search").value.toLowerCase();
	return !(mainProductName.toLowerCase().indexOf(input) == -1);
}

		
let querydata;

let productsList = ["Fiction", "iphone-14-pro"];



startGetPrice();