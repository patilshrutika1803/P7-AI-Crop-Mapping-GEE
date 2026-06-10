// ======================================
// P7 - Crop Mapping
// Study Area: Medak District, Telangana
// ======================================

// Load District Boundary
var districts = ee.FeatureCollection(
'projects/sevasetu-492213/assets/IND_Districts'
);

// Extract Medak District
var medak = districts
.filter(ee.Filter.eq('NAME_1', 'Telangana'))
.filter(ee.Filter.eq('NAME_2', 'Medak'));

Map.centerObject(medak, 9);
Map.addLayer(medak, {color:'red'}, 'Medak District');


// ============================
// Kharif Season (Jun-Oct 2023)
// ============================

var kharif = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
.filterBounds(medak)
.filterDate('2023-06-01','2023-10-31')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));


// ============================
// Rabi Season (Nov-Mar)
// ============================

var rabi = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
.filterBounds(medak)
.filterDate('2023-11-01','2024-03-31')
.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20));


// Count Images

print('Kharif Images', kharif.size());
print('Rabi Images', rabi.size());


// Create Median Composite

var kharifComposite = kharif.median().clip(medak);

var rabiComposite = rabi.median().clip(medak);


// True Color Visualization

var vis = {
bands:['B4','B3','B2'],
min:0,
max:3000
};

Map.addLayer(kharifComposite, vis, 'Kharif Composite');
Map.addLayer(rabiComposite, vis, 'Rabi Composite');
