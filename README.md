# AI-Assisted Crop Type and Cropping Pattern Mapping using Multi-Season Satellite Data

## Project Overview

This project focuses on crop type identification and cropping pattern analysis using multi-season Sentinel-2 satellite imagery and Google Earth Engine (GEE).

The workflow integrates Remote Sensing, GIS, Vegetation Index Analysis, and Machine Learning techniques to classify agricultural land into different cropping categories and estimate agricultural area statistics for Medak District, Telangana, India.

This project was developed as part of the India Space Academy (ISA) Summer Training Program 2026.

---

## Objectives

* Analyze agricultural land using multi-season satellite imagery.
* Generate NDVI maps for Kharif and Rabi seasons.
* Identify crop patterns using machine learning techniques.
* Classify land into Single Crop, Double Crop, and Fallow categories.
* Estimate crop area statistics.
* Generate vectorized outputs and cropping intensity maps.

---

## Study Area

* District: Medak
* State: Telangana
* Country: India

The study area was extracted from district boundary datasets and used as the Area of Interest (AOI) for satellite-based agricultural analysis.

---

## Data Used

### Satellite Dataset

Sentinel-2 Surface Reflectance Harmonized

Dataset ID:

`COPERNICUS/S2_SR_HARMONIZED`

### Seasons Analysed

#### Kharif Season

June 2023 – October 2023

#### Rabi Season

November 2023 – March 2024

### Spectral Bands Used

| Band | Description         |
| ---- | ------------------- |
| B4   | Red                 |
| B8   | Near Infrared (NIR) |

---

## Methodology

```text
AOI Extraction
        ↓
Sentinel-2 Data Collection
        ↓
Image Preprocessing
        ↓
NDVI Calculation
        ↓
Multi-Season Feature Creation
        ↓
Training Data Generation
        ↓
Random Forest Classification
        ↓
Accuracy Assessment
        ↓
Area Calculation
        ↓
Vector Conversion
        ↓
Cropping Intensity Mapping
```

---

## Machine Learning Model

### Random Forest Classifier

The Random Forest algorithm was trained using NDVI-derived features from Kharif and Rabi seasons.

### Classification Categories

| Class | Category    |
| ----- | ----------- |
| 0     | Single Crop |
| 1     | Double Crop |
| 2     | Fallow Land |

---

## Results

### NDVI Statistics

| Season | Mean NDVI |
| ------ | --------- |
| Kharif | 0.547     |
| Rabi   | 0.350     |

### Classification Accuracy

| Metric            | Value |
| ----------------- | ----- |
| Overall Accuracy  | 1.0   |
| Kappa Coefficient | 1.0   |

### Crop Area Statistics

| Category    |  Area (ha) |
| ----------- | ---------: |
| Single Crop | 538,610.60 |
| Double Crop | 266,519.56 |
| Fallow Land | 170,598.19 |

### Cropping Intensity Statistics

| Intensity Level |     Pixels |
| --------------- | ---------: |
| Low             |  7,767,160 |
| Medium          | 19,535,556 |
| High            |  5,880,966 |

---

## Repository Structure

```text
P7-AI-Crop-Mapping-GEE
│
├── README.md
├── scripts/
│   ├── P7_01_AOI_Extraction.js
│   ├── P7_02_Sentinel2_Loading.js
│   ├── P7_03_NDVI_Analysis.js
│   ├── P7_04_MultiSeason_Features.js
│   ├── P7_05_Training_Data.js
│   ├── P7_06_RandomForest_Classification.js
│   ├── P7_07_Accuracy_Assessment.js
│   ├── P7_08_Area_Calculation.js
│   ├── P7_09_Vector_Conversion.js
│   ├── P7_10_Cropping_Intensity_Map.js
│   └── P7_11_Final_Report_Results.js
│
├── screenshots/
└── report/
```

---

## Outputs Generated

* AOI Map
* Sentinel-2 Composite
* Kharif NDVI Map
* Rabi NDVI Map
* NDVI Difference Map
* Training Data Visualization
* Random Forest Classification Map
* Accuracy Assessment
* Area Statistics
* Vectorized Crop Polygons
* Cropping Intensity Map

---

## Tools and Technologies

* Google Earth Engine (GEE)
* Remote Sensing
* Geographic Information Systems (GIS)
* Sentinel-2 Satellite Imagery
* Random Forest Machine Learning
* JavaScript

---

## Author

Shrutika Shivaji Patil

B.Tech Computer Engineering

SVKM's NMIMS MPSTME, Shirpur Campus

Summer Training Program 2026 – India Space Academy
