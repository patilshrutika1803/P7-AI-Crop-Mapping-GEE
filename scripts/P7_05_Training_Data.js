// =====================================
// P7_05 - TRAINING DATA GENERATION
// =====================================


// =====================================
// LOAD MEDAK DISTRICT
// =====================================

var districts = ee.FeatureCollection(
'projects/sevasetu-492213/assets/IND_Districts'
);

var medak = districts
.filter(ee.Filter.eq('NAME_1','Telangana'))
.filter(ee.Filter.eq('NAME_2','Medak'));

Map.centerObject(medak,9);


// =====================================
// KHARIF NDVI
// =====================================

var kharif = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
.filterBounds(medak)
.filterDate('2023-06-01','2023-10-31')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));

var kharifComposite = kharif
.median()
.clip(medak);

var ndviKharif = kharifComposite
.normalizedDifference(['B8','B4'])
.rename('NDVI_Kharif');


// =====================================
// RABI NDVI
// =====================================

var rabi = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
.filterBounds(medak)
.filterDate('2023-11-01','2024-03-31')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));

var rabiComposite = rabi
.median()
.clip(medak);

var ndviRabi = rabiComposite
.normalizedDifference(['B8','B4'])
.rename('NDVI_Rabi');


// =====================================
// NDVI DIFFERENCE
// =====================================

var ndviDiff = ndviRabi
.subtract(ndviKharif)
.rename('NDVI_Difference');


// =====================================
// CREATE TRAINING CLASSES
// =====================================

// Single Crop
var singleCrop = ndviKharif.gt(0.5)
.and(ndviRabi.lt(0.4))
.selfMask();

// Double Crop
var doubleCrop = ndviKharif.gt(0.5)
.and(ndviRabi.gt(0.5))
.selfMask();

// Fallow Land
var fallow = ndviKharif.lt(0.3)
.and(ndviRabi.lt(0.3))
.selfMask();


// =====================================
// GENERATE SAMPLE POINTS
// =====================================

var singleSamples = singleCrop.stratifiedSample({
numPoints:100,
region:medak,
scale:10,
geometries:true
}).map(function(f){
return f.set('class',0);
});

var doubleSamples = doubleCrop.stratifiedSample({
numPoints:100,
region:medak,
scale:10,
geometries:true
}).map(function(f){
return f.set('class',1);
});

var fallowSamples = fallow.stratifiedSample({
numPoints:100,
region:medak,
scale:10,
geometries:true
}).map(function(f){
return f.set('class',2);
});


// =====================================
// MERGE TRAINING DATA
// =====================================

var trainingPoints =
singleSamples
.merge(doubleSamples)
.merge(fallowSamples);


// =====================================
// DISPLAY
// =====================================

Map.addLayer(singleSamples,{color:'yellow'},'Single Crop');

Map.addLayer(doubleSamples,{color:'green'},'Double Crop');

Map.addLayer(fallowSamples,{color:'red'},'Fallow');

print('Training Points',trainingPoints);
