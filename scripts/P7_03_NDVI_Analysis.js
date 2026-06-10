// ======================================
// Load Medak AOI
// ======================================

var districts = ee.FeatureCollection(
'projects/sevasetu-492213/assets/IND_Districts'
);

var medak = districts
.filter(ee.Filter.eq('NAME_1','Telangana'))
.filter(ee.Filter.eq('NAME_2','Medak'));

Map.centerObject(medak,9);


// ==========================
// KHARIF
// ==========================

var kharif = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
.filterBounds(medak)
.filterDate('2023-06-01','2023-10-31')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));

var kharifComposite = kharif.median().clip(medak);


// NDVI Formula
var ndviKharif = kharifComposite
.normalizedDifference(['B8','B4'])
.rename('NDVI');


// ==========================
// RABI
// ==========================

var rabi = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
.filterBounds(medak)
.filterDate('2023-11-01','2024-03-31')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));

var rabiComposite = rabi.median().clip(medak);

var ndviRabi = rabiComposite
.normalizedDifference(['B8','B4'])
.rename('NDVI');


// NDVI Visualization

var ndviVis = {
min:0,
max:1,
palette:[
'white',
'yellow',
'green',
'darkgreen'
]
};


// Display

Map.addLayer(ndviKharif,ndviVis,'Kharif NDVI');
Map.addLayer(ndviRabi,ndviVis,'Rabi NDVI');


// Statistics

print(
'Kharif NDVI Mean',
ndviKharif.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: medak,
scale: 10,
maxPixels: 1e13
})
);

print(
'Rabi NDVI Mean',
ndviRabi.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: medak,
scale: 10,
maxPixels: 1e13
})
);
