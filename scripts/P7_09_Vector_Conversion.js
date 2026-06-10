// =====================================
// LOAD DISTRICT
// =====================================

var districts = ee.FeatureCollection(
'projects/sevasetu-492213/assets/IND_Districts'
);

var medak = districts
.filter(ee.Filter.eq('NAME_1','Telangana'))
.filter(ee.Filter.eq('NAME_2','Medak'));


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

var ndviDiff = ndviRabi
.subtract(ndviKharif)
.rename('NDVI_Difference');


// =====================================
// FEATURE STACK
// =====================================

var featureStack = ee.Image.cat([
ndviKharif,
ndviRabi,
ndviDiff
]);


// =====================================
// TRAINING CLASSES
// =====================================

var singleCrop = ndviKharif.gt(0.5)
.and(ndviRabi.lt(0.4))
.selfMask();

var doubleCrop = ndviKharif.gt(0.5)
.and(ndviRabi.gt(0.5))
.selfMask();

var fallow = ndviKharif.lt(0.3)
.and(ndviRabi.lt(0.3))
.selfMask();


// =====================================
// SAMPLE POINTS
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

var trainingPoints =
singleSamples
.merge(doubleSamples)
.merge(fallowSamples);


// =====================================
// TRAIN RANDOM FOREST
// =====================================

var training = featureStack.sampleRegions({
collection: trainingPoints,
properties:['class'],
scale:10
});

var classifier =
ee.Classifier.smileRandomForest(100)
.train({
features:training,
classProperty:'class'
});


// =====================================
// CLASSIFICATION
// =====================================

var classified =
featureStack.classify(classifier);


// =====================================
// DISPLAY
// =====================================

Map.centerObject(medak,9);

Map.addLayer(
classified,
{
min:0,
max:2,
palette:[
'yellow',
'green',
'red'
]
},
'Crop Classification'
);

print('Random Forest Complete');

print('Confusion Matrix',
classifier.confusionMatrix());

print('Overall Accuracy',
classifier.confusionMatrix().accuracy());

print('Kappa Coefficient',
classifier.confusionMatrix().kappa());

// =====================================
// AREA CALCULATION
// =====================================

var areaImage = ee.Image.pixelArea()
.divide(10000)
.addBands(classified);

var areas = areaImage.reduceRegion({
  reducer: ee.Reducer.sum().group({
    groupField: 1,
    groupName: 'Class'
  }),
  geometry: medak,
  scale: 10,
  maxPixels: 1e13
});

print('Crop Areas (Hectares)', areas);
// =====================================
// VECTOR CONVERSION
// =====================================

// Convert classified raster to polygons

var vectors = classified.reduceToVectors({
  geometry: medak.geometry(),
  scale: 100,
  geometryType: 'polygon',
  reducer: ee.Reducer.countEvery(),
  maxPixels: 1e13
});

Map.addLayer(vectors,{color:'blue'},'Vectors');

print('Vector Polygons',vectors.limit(20));
