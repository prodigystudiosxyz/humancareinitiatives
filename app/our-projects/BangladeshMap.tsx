'use client';
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import styles from './BangladeshMap.module.css';

interface District {
    id: string;
    name: string;
    coordinates: [number, number]; // [longitude, latitude]
    active: boolean;
    description: string;
}

const geoUrl = '/bangladesh.geojson';

const districts: District[] = [
    { id: 'dhaka', name: 'Dhaka', coordinates: [90.4125, 23.8103], active: true, description: 'Central hub for logistics and emergency relief coordination.' },
    { id: 'sylhet', name: 'Sylhet', coordinates: [91.8687, 24.8949], active: true, description: 'Ongoing sustainable water projects and education hubs.' },
    { id: 'chittagong', name: 'Chittagong', coordinates: [91.7832, 22.3569], active: true, description: 'Coastal protection and livelihood support for fishing communities.' },
    { id: 'rajshahi', name: 'Rajshahi', coordinates: [88.6042, 24.3745], active: true, description: 'Agricultural development and women empowerment programs.' },
    { id: 'khulna', name: 'Khulna', coordinates: [89.5400, 22.8456], active: true, description: 'Climate resilience initiatives in mangrove forest areas.' },
    { id: 'rangpur', name: 'Rangpur', coordinates: [89.2500, 25.7500], active: true, description: 'Winter relief and child nutrition programs in northern regions.' },
    { id: 'barisal', name: 'Barisal', coordinates: [90.3667, 22.7000], active: true, description: 'Healthcare mobile units and floating clinics in riverine areas.' },
    { id: 'coxsbazar', name: 'Cox\'s Bazar', coordinates: [92.0058, 21.4272], active: true, description: 'Refugee support and mental health initiatives.' },
];

export default function BangladeshMap() {
    const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);

    return (
        <div className={styles.mapWrapper}>
            <div className={styles.mapHeader}>
                <h2 className={styles.mapTitle}>Our Impact Across Bangladesh</h2>
                <p className={styles.mapSubtitle}>Hover over the districts to see our work.</p>
            </div>

            <div className={styles.svgContainer}>
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 4500,
                        center: [90.35, 23.68] // center over Bangladesh
                    }}
                    className={styles.mapSvg}
                >
                    <Geographies geography={geoUrl}>
                        {({ geographies }: any) =>
                            geographies.map((geo: any) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    className={styles.bdOutline}
                                    style={{
                                        default: { stroke: "#ccc", strokeWidth: 0.5, outline: "none" },
                                        hover: { fill: "#f0f0f0", stroke: "#999", strokeWidth: 0.5, outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {districts.map(d => (
                        <Marker key={d.id} coordinates={d.coordinates}>
                            <g
                                onMouseEnter={() => setHoveredDistrict(d)}
                                onMouseLeave={() => setHoveredDistrict(null)}
                                className={styles.districtPoint}
                            >
                                <circle r={3} className={`${styles.point} ${d.active ? styles.pointActive : ''}`} />
                                {hoveredDistrict?.id === d.id && (
                                    <circle r={8} className={styles.pointPulse} />
                                )}
                            </g>
                        </Marker>
                    ))}
                </ComposableMap>

                {hoveredDistrict && (
                    <div className={styles.tooltipBox}>
                        <h4 className={styles.tooltipName}>{hoveredDistrict.name}</h4>
                        <p className={styles.tooltipText}>{hoveredDistrict.description}</p>
                    </div>
                )}
            </div>

            <div className={styles.infoBox}>
                {hoveredDistrict ? (
                    <div className={styles.details}>
                        <h3 className={styles.detailsTitle}>{hoveredDistrict.name} District</h3>
                        <p className={styles.detailsContent}>{hoveredDistrict.description}</p>
                    </div>
                ) : (
                    <p className={styles.infoPlaceholder}>Select a highlighted district on the map to view impact details.</p>
                )}
            </div>
        </div>
    );
}
