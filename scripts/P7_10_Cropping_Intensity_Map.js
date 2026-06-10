// =====================================
// CROPPING INTENSITY MAP
// =====================================

// Load district

var districts = ee.FeatureCollection(
'projects/sevasetu-492213/assets/IND_Districts'
);

var medak = districts
.filter(ee.Filter.eq('NAME_1','Telangana'))
.filter(ee.Filter.eq('NAME_2','Medak'));


// =====================================
// KHARIF NDVI
// =====================================

var kharif = ee.ImageCollection(
'COPERNICUS/S2_SR_HARMONIZED'
)
.filterBounds(medak)
.filterDate('2023-06-01','2023-10-31')
.filter(ee.Filter.lt(
'CLOUDY_PIXEL_PERCENTAGE',
20
));

var kharifComposite =
kharif.median().clip(medak);

var ndviKharif =
kharifComposite.normalizedDifference(
['B8','B4']
);


// =====================================
// RABI NDVI
// =====================================

var rabi = ee.ImageCollection(
'COPERNICUS/S2_SR_HARMONIZED'
)
.filterBounds(medak)
.filterDate('2023-11-01','2024-03-31')
.filter(ee.Filter.lt(
'CLOUDY_PIXEL_PERCENTAGE',
20
));

var rabiComposite =
rabi.median().clip(medak);

var ndviRabi =
rabiComposite.normalizedDifference(
['B8','B4']
);


// =====================================
// NDVI DIFFERENCE
// =====================================

var ndviDiff =
ndviRabi.subtract(ndviKharif);


// =====================================
// CROPPING INTENSITY
// =====================================

var intensity =
ndviDiff.expression(
"(b < -0.1) ? 0" +
": (b < 0.1) ? 1" +
": 2",
{
b: ndviDiff
});


// =====================================
// DISPLAY
// =====================================

Map.centerObject(medak,9);

Map.addLayer(
intensity,
{
min:0,
max:2,
palette:[
'red',
'yellow',
'green'
]
},
'Cropping Intensity'
);


// =====================================
// STATISTICS
// =====================================

print(
'Cropping Intensity Classes',
intensity.reduceRegion({
reducer:
ee.Reducer.frequencyHistogram(),
geometry: medak,
scale:10,
maxPixels:1e13
})
);
