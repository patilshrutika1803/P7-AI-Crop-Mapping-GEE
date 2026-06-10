var districts = ee.FeatureCollection(
'projects/sevasetu-492213/assets/IND_Districts'
);

var medak = districts
  .filter(ee.Filter.eq('NAME_1', 'Telangana'))
  .filter(ee.Filter.eq('NAME_2', 'Medak'));

Map.centerObject(medak, 9);
Map.addLayer(medak, {color:'red'}, 'Medak District');

print(medak);
