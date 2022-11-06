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
		productSeller = [], productName = [], productPrice = [], productDiscountPrice = [], productLink = [];
		
		for(let j=0; j<querydata[productsList[i]].productSellers.length; j++) {
			if(!querydata[productsListItem].productSellers[j] ||
				querydata[productsList[i]].productSellers[j].productSeller == "X" ||
				querydata[productsList[i]].productSellers[j].productName == "X" ||
				querydata[productsList[i]].productSellers[j].productPrice == "999999999") {
				continue;
			};
			productSeller.push(querydata[productsList[i]].productSellers[j].productSeller);
			productName.push(querydata[productsList[i]].productSellers[j].productName);
			if (querydata[productsList[i]].productSellers[j].productDiscountPrice > querydata[productsList[i]].productSellers[j].productPrice) {
				productPrice.push(querydata[productsList[i]].productSellers[j].productPrice);
				productDiscountPrice.push(false);
			} else {
				productPrice.push(querydata[productsList[i]].productSellers[j].productDiscountPrice);
				productDiscountPrice.push(true);
			}
			productLink.push(querydata[productsList[i]].productSellers[j].productLink);
		};

		if (filter(mainProductName)) {
			makeProductPriceElement(queryDate, productsListItem, mainProductName, subProductName, productSeller, productName, productPrice, productDiscountPrice, productLink);
		}
	}

	mainFunctions();

}

function filter(mainProductName) {
	let input = searchInput.value.toLowerCase();
	return !(mainProductName.toLowerCase().indexOf(input) == -1);
}

function makeProductPriceElement(queryDate, productsListItem, mainProductName, subProductName, productSeller, productName, productPrice, productDiscountPrice, productLink) {

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
			<h3>${parseInt(productPrice[k]).toLocaleString('hu-HU')} <span>Ft
			${productDiscountPrice[k] ?
			'<span class="material-symbols-outlined specialPrice">percent</span>' : ""}
			</span>
			</h3>
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

let bySort = parseInt(localStorage.getItem("sort") || 0);

document.querySelector(`.footerMenuBoxes .sortBox h6:nth-child(${bySort + 1})`).classList.add("selected");

let productsListSortBy = ["ascendingByPrice", "descendingByPrice", "ascendingAccordingToAbc", "descendingAccordingToAbc"];
let productsListSortData = productsListSortBy[bySort];
let productsList = [];

let searchInput = document.querySelector("#search");

document.querySelector("footer .innerFooter span:nth-child(1)").addEventListener('click', refreshList);
function refreshList() {
	searchInput.value = "";
	startGetPrice();
}

let openMenuSortBox = false;
document.querySelector("footer .innerFooter span:nth-child(2)").addEventListener('click', sortList);
function sortList() {
	if(openMenuSortBox) {
		document.querySelector(".footerMenuBoxes").style.height="0";
		document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
		document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
		openMenuSortBox = false;
	} else {
		document.querySelector(".footerMenuBoxes .settingsBox").style.bottom="-400px";
		openMenuSettingsBox = false;
		document.querySelector(".footerMenuBoxes").style.height="400px";
		document.querySelector(".footerMenuBoxes").style.paddingBottom="20px";
		document.querySelector(".footerMenuBoxes .sortBox").style.bottom="20px";
		openMenuSortBox = true;
	}
}

document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(1)").addEventListener('click', sortList1);
function sortList1() {
	document.querySelector(".footerMenuBoxes").style.height="0";
	document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
	document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
	openMenuSortBox = false;
	bySort = 0;
	localStorage.setItem("sort", 0);
	productsListSortData = productsListSortBy[bySort];
	showProductPrice();
	document.querySelectorAll(".footerMenuBoxes .sortBox h6").forEach((el) => el.classList.remove("selected"));
	document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(1)").classList.add("selected");
}

document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(2)").addEventListener('click', sortList2);
function sortList2() {
	document.querySelector(".footerMenuBoxes").style.height="0";
	document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
	document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
	openMenuSortBox = false;
	bySort = 1;
	localStorage.setItem("sort", 1);
	productsListSortData = productsListSortBy[bySort];
	showProductPrice();
	document.querySelectorAll(".footerMenuBoxes .sortBox h6").forEach((el) => el.classList.remove("selected"));
	document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(2)").classList.add("selected");
}

document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(3)").addEventListener('click', sortList3);
function sortList3() {
	document.querySelector(".footerMenuBoxes").style.height="0";
	document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
	document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
	openMenuSortBox = false;
	bySort = 2;
	localStorage.setItem("sort", 2);
	productsListSortData = productsListSortBy[bySort];
	showProductPrice();
	document.querySelectorAll(".footerMenuBoxes .sortBox h6").forEach((el) => el.classList.remove("selected"));
	document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(3)").classList.add("selected");
}

document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(4)").addEventListener('click', sortList4);
function sortList4() {
	document.querySelector(".footerMenuBoxes").style.height="0";
	document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
	document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
	openMenuSortBox = false;
	bySort = 3;
	localStorage.setItem("sort", 3);
	productsListSortData = productsListSortBy[bySort];
	showProductPrice();
	document.querySelectorAll(".footerMenuBoxes .sortBox h6").forEach((el) => el.classList.remove("selected"));
	document.querySelector(".footerMenuBoxes .sortBox h6:nth-child(4)").classList.add("selected");
}

let openSearch = false;
document.querySelector("footer .innerFooter span:nth-child(3)").addEventListener('click', searchBtnToggle);
function searchBtnToggle() {
	if(openSearch) {
		document.querySelector("body").style.gridTemplateRows="calc(10px + env(safe-area-inset-top)) 1fr calc(50px + env(safe-area-inset-bottom))";
		document.querySelector("header.mainHeader").style.paddingBottom="50px";
		openSearch = false;
		searchInput.value = "";
		showProductPrice();
	} else {
		document.querySelector("header.mainHeader").style.paddingBottom="0";
		document.querySelector("body").style.gridTemplateRows="calc(50px + env(safe-area-inset-top)) 1fr calc(50px + env(safe-area-inset-bottom))";
		openSearch = true;
		searchInput.focus();
	}
}
document.querySelector("body").addEventListener("keyup", function(e) {
});

searchInput.addEventListener('keyup', (e) => {
	if (e.key === "Enter") {
		e.preventDefault();
		searchInput.blur(); 
	} else {
		showProductPrice();
	}
});

let openMenuSettingsBox = false;
document.querySelector("footer .innerFooter span:nth-child(4)").addEventListener('click', settingsList);
function settingsList() {
	if(openMenuSettingsBox) {
		document.querySelector(".footerMenuBoxes").style.height="0";
		document.querySelector(".footerMenuBoxes").style.paddingBottom="0";
		document.querySelector(".footerMenuBoxes .settingsBox").style.bottom="-400px";
		openMenuSettingsBox = false;
	} else {
		document.querySelector(".footerMenuBoxes .sortBox").style.bottom="-400px";
		openMenuSortBox = false;
		document.querySelector(".footerMenuBoxes").style.height="400px";
		document.querySelector(".footerMenuBoxes").style.paddingBottom="20px";
		document.querySelector(".footerMenuBoxes .settingsBox").style.bottom="20px";
		openMenuSettingsBox = true;
	}
}

let colors = {
	"eerie-black": "rgb(29, 29, 29)",
	"jet": "rgb(55, 55, 55)",
	"cultured": "rgb(245, 245, 245)",
	"gainsboro": "rgb(224, 224, 224)",
	"gray-web": "rgb(124, 124, 124)",
	"sunray": "rgb(222, 165, 75)",
	"orange-yellow-crayola": "rgb(242, 205, 93)",
	"cadet-grey": "rgb(141, 167, 190)",
	"columbia-blue": "rgb(205, 230, 245)",
	"ao-english": "rgb(21, 127, 31)",
	"emerald": "rgb(76, 185, 99)",
	"honey-yellow": "rgb(247, 179, 43)",
	"blond": "rgb(252, 246, 177)",
	"light-coral": "rgb(246, 130, 140)",
	"mauvelous": "rgb(245, 156, 169)",
	"cadet-blue": "rgb(88, 164, 176)",
	"middle-purple": "rgb(210, 130, 166)",
	"honolulu-blue": "rgb(14, 107, 168)",
	"non-photo-blue": "rgb(166, 225, 250)",
	"laser-lemon": "rgb(252, 255, 108)",
	"yellow-green-crayola": "rgb(215, 255, 171)",
	"flame": "rgb(228, 87, 46)",
	"tiffany-blue": "rgb(23, 190, 187)",
	"sunglow": "rgb(255, 201, 20)",
	"green-ryb": "rgb(118, 176, 65)",
	"royal-purple": "rgb(114, 78, 145)",
	"african-violet": "rgb(176, 132, 204)",
	"orange-pantone": "rgb(255, 87, 10)",
	"cerulean-crayola": "rgb(0, 165, 207)"
}
let backgroundColor = localStorage.getItem("backgroundColor") || "eerie-black";
document.documentElement.style.setProperty("--background-color", colors[backgroundColor]);
document.querySelector(`#backgroundColor [value=${backgroundColor}]`).selected = true;
document.querySelector("#backgroundColor").addEventListener( 'change', () => {
	document.documentElement.style.setProperty("--background-color", colors[document.querySelector("#backgroundColor").selectedOptions[0].value]);
	localStorage.setItem("backgroundColor", document.querySelector("#backgroundColor").selectedOptions[0].value);
})
let productBackgroundColor = localStorage.getItem("productBackgroundColor") || "jet";
document.documentElement.style.setProperty("--product-background-color", colors[productBackgroundColor]);
document.querySelector(`#productBackgroundColor [value=${productBackgroundColor}]`).selected = true;
document.querySelector("#productBackgroundColor").addEventListener( 'change', () => {
	document.documentElement.style.setProperty("--product-background-color", colors[document.querySelector("#productBackgroundColor").selectedOptions[0].value]);
	localStorage.setItem("productBackgroundColor", document.querySelector("#productBackgroundColor").selectedOptions[0].value);
})
let mainThemeColor = localStorage.getItem("mainThemeColor") || "sunray";
document.documentElement.style.setProperty("--main-theme-color", colors[mainThemeColor]);
document.querySelector(`#mainThemeColor [value=${mainThemeColor}]`).selected = true;
document.querySelector("#mainThemeColor").addEventListener( 'change', () => {
	document.documentElement.style.setProperty("--main-theme-color", colors[document.querySelector("#mainThemeColor").selectedOptions[0].value]);
	localStorage.setItem("mainThemeColor", document.querySelector("#mainThemeColor").selectedOptions[0].value);
})
let fontMainColor = localStorage.getItem("fontMainColor") || "cultured";
document.documentElement.style.setProperty("--font-main-color", colors[fontMainColor]);
document.querySelector(`#fontMainColor [value=${fontMainColor}]`).selected = true;
document.querySelector("#fontMainColor").addEventListener( 'change', () => {
	document.documentElement.style.setProperty("--font-main-color", colors[document.querySelector("#fontMainColor").selectedOptions[0].value]);
	localStorage.setItem("fontMainColor", document.querySelector("#fontMainColor").selectedOptions[0].value);
})
let fontSecondaryColor = localStorage.getItem("fontSecondaryColor") || "gray-web";
document.documentElement.style.setProperty("--font-secondary-color", colors[fontSecondaryColor]);
document.querySelector(`#fontSecondaryColor [value=${fontSecondaryColor}]`).selected = true;
document.querySelector("#fontSecondaryColor").addEventListener( 'change', () => {
	document.documentElement.style.setProperty("--font-secondary-color", colors[document.querySelector("#fontSecondaryColor").selectedOptions[0].value]);
	localStorage.setItem("fontSecondaryColor", document.querySelector("#fontSecondaryColor").selectedOptions[0].value);
})

startGetPrice();