// =====================================
// MEDAK DISTRICT AOI
// =====================================

var districts = ee.FeatureCollection(
'projects/sevasetu-492213/assets/IND_Districts'
);

var medak = districts
.filter(ee.Filter.eq('NAME_1','Telangana'))
.filter(ee.Filter.eq('NAME_2','Medak'));

Map.centerObject(medak,9);


// =====================================
// KHARIF
// =====================================

var kharif = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
.filterBounds(medak)
.filterDate('2023-06-01','2023-10-31')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));

var kharifComposite = kharif.median().clip(medak);

var ndviKharif = kharifComposite
.normalizedDifference(['B8','B4'])
.rename('NDVI_Kharif');


// =====================================
// RABI
// =====================================

var rabi = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
.filterBounds(medak)
.filterDate('2023-11-01','2024-03-31')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));

var rabiComposite = rabi.median().clip(medak);

var ndviRabi = rabiComposite
.normalizedDifference(['B8','B4'])
.rename('NDVI_Rabi');


// =====================================
// NDVI DIFFERENCE
// =====================================

var ndviDiff = ndviRabi.subtract(ndviKharif)
.rename('NDVI_Difference');


// Visualization

var diffVis = {
min:-0.5,
max:0.5,
palette:['red','yellow','green']
};

Map.addLayer(
ndviDiff,
diffVis,
'NDVI Difference'
);


// Statistics

print(
'NDVI Difference Mean',
ndviDiff.reduceRegion({
reducer: ee.Reducer.mean(),
geometry: medak,
scale: 10,
maxPixels: 1e13
})
);
