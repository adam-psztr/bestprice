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

	document.querySelector("main").innerHTML = `<div class="productsSeparator"></div>`;

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

	mainFunctions();

}

function filter(mainProductName) {
	let input = searchInput.value.toLowerCase();
	return !(mainProductName.toLowerCase().indexOf(input) == -1);
}

function makeProductPriceElement(queryDate, productsListItem, mainProductName, subProductName, productSeller, productName, productPrice, productLink) {

	if(productPrice.length == 0) {
		return
	};

	let bestPrice = Math.min(...productPrice).toLocaleString('hu-HU');

	let sampleHeader = `<div class="fullQueryProduct">
		<article class="bestPrice">
		<header>
		<div class="productPic">
		<img src="./img/products/${productsListItem}.jpg" alt="${productsListItem}">
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
		<div class="insetBorderHover"></div>
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
			<img src="./img/sellers/${productSeller[k]}.jpg" alt="${productSeller[k]} logo">
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
		</article>
		</div>
		<div class="productsSeparator"></div>`;
	
	document.querySelector("main").innerHTML += sampleHeader + sampleSellers + sampleSellerEnd;
	
}

function mainFunctions() {
	
	document.querySelectorAll("main article.bestPrice").forEach((el)=> el.addEventListener('click', dropDown));
	
	function dropDown(e) {
	e.srcElement.parentElement.parentElement.children[1].clientHeight == 0 ? e.srcElement.parentElement.parentElement.children[1].style.height = e.srcElement.parentElement.parentElement.children[1].children[0].clientHeight + "px" : e.srcElement.parentElement.parentElement.children[1].style.height = "0";
	}

}

let querydata;

let productsListSortBy = ["ascendingByPrice", "descendingByPrice", "ascendingAccordingToAbc", "descendingAccordingToAbc"];
let productsListSortData = productsListSortBy[0];
let productsList = [];

let searchInput = document.querySelector("#search");

document.querySelector("footer .innerFooter span:nth-child(1)").addEventListener('click', refreshList);
function refreshList() {
	searchInput.value = "";
	startGetPrice();
}

document.querySelector("footer .innerFooter span:nth-child(2)").addEventListener('click', sortList);
function sortList() {
	document.querySelector(".footerMenuBoxes").style.height="400px";
	document.querySelector(".footerMenuBoxes").style.paddingBottom="20px";
	document.querySelector(".footerMenuBoxes .sortBox").style.bottom="0";
}

document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(1)").addEventListener('click', sortList1);
function sortList1() {
	document.querySelector(".footerMenuBoxes").style.height="0";
	document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
	document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
	productsListSortData = productsListSortBy[0];
	showProductPrice();
}

document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(2)").addEventListener('click', sortList2);
function sortList2() {
	document.querySelector(".footerMenuBoxes").style.height="0";
	document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
	document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
	productsListSortData = productsListSortBy[1];
	showProductPrice();
}

document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(3)").addEventListener('click', sortList3);
function sortList3() {
	document.querySelector(".footerMenuBoxes").style.height="0";
	document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
	document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
	productsListSortData = productsListSortBy[2];
	showProductPrice();
}

document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(4)").addEventListener('click', sortList4);
function sortList4() {
	document.querySelector(".footerMenuBoxes").style.height="0";
	document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
	document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
	productsListSortData = productsListSortBy[3];
	showProductPrice();
}

searchInput.addEventListener('keyup', () => {
	showProductPrice();
});

startGetPrice();