//--ideda zemelapi
var map = L.map('map').setView([55.1694, 23.8813], 5);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
	attribution: '<a href="http://cartodb.com/attributions">CartoDB</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> | <a href="https://www.koronamap.lt" target="_blank">&copy; koronamap.lt</a>',
	maxZoom: 10
}).addTo(map);
//--pakeicia skaiciau formata
function formatNumber (num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
//--pasaulio informacija
$.getJSON('https://disease.sh/v2/all', function(data) {
	        
	var wcases = `${data.cases}`
	var wrecovered = `${data.recovered}`
	var wdeaths = `${data.deaths}`

	$(".wcases").html(formatNumber(wcases));
	$(".wrecovered").html(formatNumber(wrecovered));
	$(".wdeaths").html(formatNumber(wdeaths));
});
//--lt info
(async () => {
	let url = 'https://services.arcgis.com/XdDVrnFqA9CT3JgB/arcgis/rest/services/covid_locations/FeatureServer/0/query?where=0%3D0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=Atvejai+DESC&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=';
	let response = await fetch(url);
	let commits = await response.json();

	for (var i = 0; i < commits.features.length; i++) {
		var miestas = commits.features[i].attributes.Miestas;
		var lat = commits.features[i].attributes.Lat;
		var long = commits.features[i].attributes.Long;
		var atvejai = commits.features[i].attributes.Atvejai;
		var pasveiko = commits.features[i].attributes.Pasveiko;
		var mire = commits.features[i].attributes.Mirė;
		if(atvejai !== null) {
			if(atvejai > 50) {
			rad = 12000;
			} else if (atvejai > 20) {
				rad = 9500;
			} else if (atvejai > 10) {
				rad = 8000;
			} else  if (atvejai > 5){
				rad = 6000;
			} else {
				rad = 5000;
			}

			var salis = L.circle([lat, long], {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.4,
				radius: rad
			}).addTo(map);

			salis.bindPopup("<div class='container'><div class='row'><div class='col-12 centras p-1'><h5>"+miestas+"</h5></div><div class='col-12 p-1'><div class='map-sidebar-card' data-text='Susirgimai'>"+formatNumber(atvejai)+"</div></div><div class='col-6 p-1'><div class='map-sidebar-card' data-text='Pasveiko'>"+formatNumber(pasveiko)+"</div></div><div class='col-6 p-1'><div class='map-sidebar-card' data-text='Mirė'>"+formatNumber(mire)+"</div></div></div></div>", {minWidth: 250});

			var node = document.createElement("tr");
			node.innerHTML = "<th scope='row' class='max-width: 90px;'>"+miestas+"</th><td>"+formatNumber(atvejai)+"</td><td>"+formatNumber(pasveiko)+"</td><td>"+formatNumber(mire)+"</td>";
			document.getElementById("ltstat").appendChild(node);
		}	
	}
})();
//--visu saliu informacija
(async () => {
let url = 'https://disease.sh/v2/countries?sort=cases';
let response = await fetch(url);
let commits = await response.json(); // read response body and parse as JSON

//let url1 = 'https://koronamap.lt/ltpav/';
//let response1 = await fetch(url1);
//let commits1 = await response1.json();

let url2 = 'https://disease.sh/v2/countries?yesterday=true';
let response2 = await fetch(url2);
let commits2 = await response2.json();

for (var i = 0; i < commits.length; i++) {
	var id = commits[i].countryInfo._id; /*
	for (var m = 0; m < commits1.length; m++) {
		var ltid = commits1[m].id;
		if (id == ltid) {
			var ltpav = commits1[m].name;
			break;
		}
	} */
	for (var n = 0; n < commits2.length; n++) {
		var tid = commits2[n].countryInfo._id;
		if (id == tid) {
			var yesterdayc = commits2[n].cases;
			var yesterdayr = commits2[n].recovered;
			var yesterdayd = commits2[n].deaths;
			break;
		}
	}
	var ltpav = commits[i].country;

	var lat = commits[i].countryInfo.lat;
	var long = commits[i].countryInfo.long;
	var flag = commits[i].countryInfo.flag;
	var cases = commits[i].cases;
	var deaths = commits[i].deaths;
	var recovered = commits[i].recovered;
	var newtotalc = cases - yesterdayc;
	var newtotalr = recovered - yesterdayr;
	var newtotald = deaths - yesterdayd; 
	if (commits[i].country !== "Lithuania" && commits[i].country !== "World") {
		/*Draw a red circle at that location. Bigger circle means worse hit*/
			var rad = cases;
			var exp = rad.toString().length - 1;
			
			if(exp > 3) {
				/*Max exponential is 3. Otherwise significant difference not seen*/
				exp = 3;
			}

			if(rad < 10) {
				/*Shouldn't be too small*/
				rad = 5;
			}
			else {
				rad = 5 + (rad / Math.pow(10, exp)) + (10 * (exp - 1));
				if(rad > 50) {
					/*Significant difference must be seen. But radius > 50 is too big.*/
					rad = 50;
				}
			}
		var salis = L.circleMarker([lat, long], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.4,
		radius: rad
	}).addTo(map);

	salis.bindPopup("<div class='container'><div class='row'><div class='col-12 centras p-1'><h5>"+ltpav+"</h5></div><div class='col-12 p-1'><div class='map-sidebar-card' data-text='Susirgimai'>"+formatNumber(cases)+"</div></div><div class='col-6 p-1'><div class='map-sidebar-card' data-text='Pasveiko'>"+formatNumber(recovered)+"</div></div><div class='col-6 p-1'><div class='map-sidebar-card' data-text='Mirė'>"+formatNumber(deaths)+"</div></div></div></div>", {minWidth: 250})
	}
	var pav = commits[i].country;
	if (pav !== "World") {
		var node = document.createElement("tr");
		node.innerHTML = "<th scope='row' style='max-width: 110px;'><img src="+flag+" style='width: 15px; margin-right: 5px;'>"+ltpav+"</th><td class='centras'>"+formatNumber(cases)+"<br><span class='badge badge-warning badgemin d-flex justify-content-center'>+"+formatNumber(newtotalc)+"</span></td><td class='centras'>"+formatNumber(recovered)+"<br><span class='badge badge-success badgemin d-flex justify-content-center'>+"+formatNumber(newtotalr)+"</span></td><td class='centras'>"+formatNumber(deaths)+"<br><span class='badge badge-danger badgemin d-flex justify-content-center'>+"+formatNumber(newtotald)+"</span></td>";
		document.getElementById("statist").appendChild(node);
	} else {
		pav = "Pasaulis";
		var node = document.createElement("tr");
		node.innerHTML = "<th scope='row' style='max-width: 110px;'>"+pav+"</th><td class='centras'>"+formatNumber(cases)+"<br><span class='badge badge-warning badgemin d-flex justify-content-center'>+"+formatNumber(newtotalc)+"</span></td><td class='centras'>"+formatNumber(recovered)+"<br><span class='badge badge-success badgemin d-flex justify-content-center'>+"+formatNumber(newtotalr)+"</span></td><td class='centras'>"+formatNumber(deaths)+"<br><span class='badge badge-danger badgemin d-flex justify-content-center'>+"+formatNumber(newtotald)+"</span></td>";
		document.getElementById("statist").appendChild(node);
	}
	
}	
})();
//
var sidebar = L.control.sidebar('sidebar').addTo(map);
//
$.getJSON('https://disease.sh/v2/countries/Lithuania', function(data) {
	        
	var cases = `${data.cases}`
	var lactive = `${data.active}`
	var todayCases = `${data.todayCases}`
	var recovered = `${data.recovered}`
	var deaths = `${data.deaths}`
	var todayDeaths = `${data.todayDeaths}`
	var critical = `${data.critical}`
	var updated = `${data.updated}`

	$(".cases").html(cases);
	$(".lactive").html(lactive);
	$(".todayCases").html(todayCases);
	$(".recovered").html(recovered);
	$(".deaths").html(deaths);
	$(".todayDeaths").html(todayDeaths);
	$(".critical").html(critical);
});
//--
n =  new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = y + "-" + m + "-" + d +" duomenimis";
//--
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h2 style="color: white; padding-right: 10px;">koronamap.lt</h2>';
};

info.addTo(map);


