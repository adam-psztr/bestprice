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
		data => proba(data)
	);
}

let querydata;

startGetPrice();

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
