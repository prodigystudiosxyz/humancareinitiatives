'use client';
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import styles from './BangladeshMap.module.css';

interface DistrictInfo {
    name: string;
    coordinates: [number, number]; // [longitude, latitude]
    subprojects: { title: string; slug: string; project_slug: string }[];
}

const geoUrl = '/bangladesh.geojson';

const DISTRICT_COORDS: Record<string, [number, number]> = {
    'Barguna': [90.1122, 22.0953],
    'Barishal': [90.3667, 22.7010],
    'Bhola': [90.7101, 22.3164],
    'Jhalokati': [90.1870, 22.5781],
    'Patuakhali': [90.3349, 22.3529],
    'Pirojpur': [89.9749, 22.5791],
    'Bandarban': [92.2288, 22.1953],
    'Brahmanbaria': [91.1150, 23.9571],
    'Chandpur': [90.6406, 23.2321],
    'Chattogram': [91.7832, 22.3569],
    'Cumilla': [91.1717, 23.4607],
    "Cox's Bazar": [92.0058, 21.4272],
    'Feni': [91.3976, 23.0159],
    'Khagrachari': [91.9514, 23.1192],
    'Lakshmipur': [90.8464, 22.9429],
    'Noakhali': [91.0970, 22.8724],
    'Rangamati': [92.1791, 22.7324],
    'Dhaka': [90.4125, 23.8103],
    'Faridpur': [89.8437, 23.6071],
    'Gazipur': [90.4200, 24.0023],
    'Gopalganj': [89.8273, 23.0031],
    'Kishoreganj': [90.7816, 24.4260],
    'Madaripur': [90.1883, 23.1648],
    'Manikganj': [90.0052, 23.8644],
    'Munshiganj': [90.5341, 23.5422],
    'Narayanganj': [90.5000, 23.6238],
    'Narsingdi': [90.7177, 23.9229],
    'Rajbari': [89.6525, 23.7574],
    'Shariatpur': [90.3473, 23.2423],
    'Tangail': [89.9214, 24.2513],
    'Bagerhat': [89.7895, 22.6515],
    'Chuadanga': [88.8529, 23.6331],
    'Jashore': [89.2139, 23.1664],
    'Jhenaidah': [89.1726, 23.5450],
    'Khulna': [89.5400, 22.8456],
    'Kushtia': [89.1214, 23.9010],
    'Magura': [89.4136, 23.4875],
    'Meherpur': [88.6264, 23.7622],
    'Narail': [89.5053, 23.1725],
    'Satkhira': [89.1000, 22.7185],
    'Jamalpur': [89.9254, 24.9375],
    'Mymensingh': [90.4073, 24.7471],
    'Netrakona': [90.7275, 24.8700],
    'Sherpur': [90.0125, 25.0204],
    'Bogura': [89.3730, 24.8481],
    'Joypurhat': [89.0261, 25.0947],
    'Naogaon': [88.9414, 24.7936],
    'Natore': [88.9320, 24.4143],
    'Chapai Nawabganj': [88.2709, 24.5965],
    'Pabna': [89.2336, 24.0061],
    'Rajshahi': [88.6042, 24.3745],
    'Sirajganj': [89.7083, 24.4577],
    'Dinajpur': [88.6332, 25.6217],
    'Gaibandha': [89.4423, 25.3283],
    'Kurigram': [89.6450, 25.8072],
    'Lalmonirhat': [89.4483, 25.9119],
    'Nilphamari': [88.9414, 25.9317],
    'Panchagarh': [88.5552, 26.3331],
    'Rangpur': [89.2500, 25.7500],
    'Thakurgaon': [88.4608, 26.0336],
    'Habiganj': [91.4111, 24.3833],
    'Moulvibazar': [91.7685, 24.4797],
    'Sunamganj': [91.3992, 25.0662],
    'Sylhet': [91.8687, 24.8949],
};

export default function BangladeshMap() {
    const supabase = createClient();
    const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo | null>(null);
    const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null);
    const [activeDistricts, setActiveDistricts] = useState<DistrictInfo[]>([]);

    useEffect(() => {
        const fetchLocations = async () => {
            const { data } = await supabase
                .from('subprojects')
                .select('title, slug, projects(slug), locations');

            if (data) {
                const districtMap: Record<string, { title: string; slug: string; project_slug: string }[]> = {};

                data.forEach(sub => {
                    if (sub.locations && Array.isArray(sub.locations)) {
                        sub.locations.forEach((loc: string) => {
                            let district = loc;
                            // Clean up common variations or sub-locations if they appear as strings
                            if (loc === 'Bishwanath' || loc === 'Rampasha' || loc === 'Kanaighat' || loc === 'Golapganj' || loc === 'Borolekha' || loc === 'Sylhet – Sadar') district = 'Sylhet';
                            if (loc === 'Ukhiya' || loc === 'Teknaf' || loc === 'Kutupalong' || loc === 'Balukhali' || loc === 'Jamtoli') district = "Cox's Bazar";
                            if (loc === 'Cox’s Bazar') district = "Cox's Bazar";
                            if (loc === 'Amin Bazar' || loc === 'Savar' || loc === 'Dhaka City') district = 'Dhaka';
                            if (loc === 'Dupchanchia') district = 'Bogura';
                            if (loc === 'Hatiya' || loc === 'Daganbhuiyan') district = 'Noakhali';
                            if (loc === 'Jibannagar') district = 'Chuadanga';
                            if (loc === 'Abhaynagar') district = 'Jashore';
                            if (loc === 'Kotchandpur') district = 'Jhenaidah';
                            if (loc === 'Chapainawabganj') district = 'Chapai Nawabganj';

                            if (DISTRICT_COORDS[district]) {
                                if (!districtMap[district]) districtMap[district] = [];
                                if (!districtMap[district].some(s => s.title === sub.title)) {
                                    districtMap[district].push({
                                        title: sub.title,
                                        slug: sub.slug,
                                        project_slug: (sub.projects as any)?.slug || 'general'
                                    });
                                }
                            }
                        });
                    }
                });

                const formatted = Object.entries(districtMap).map(([name, subs]) => ({
                    name,
                    coordinates: DISTRICT_COORDS[name],
                    subprojects: subs
                }));
                setActiveDistricts(formatted);
            }
        };

        fetchLocations();
    }, []);

    return (
        <div className={styles.mapWrapper}>
            <div className={styles.mapHeader}>
                <h2 className={styles.mapTitle}>Our Impact Across Bangladesh</h2>
                <p className={styles.mapSubtitle}>Hover over highlighted districts to see our active projects.</p>
            </div>

            <div className={styles.svgContainer}>
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 4500,
                        center: [90.35, 23.68]
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
                                        default: { stroke: "#e2e8f0", strokeWidth: 0.5, outline: "none", fill: "#f8fafc" },
                                        hover: { fill: "#f1f5f9", stroke: "#cbd5e1", strokeWidth: 0.5, outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {activeDistricts.map(d => (
                        <Marker key={d.name} coordinates={d.coordinates}>
                            <g
                                onMouseEnter={() => setHoveredDistrict(d)}
                                onMouseLeave={() => setHoveredDistrict(null)}
                                onClick={() => setSelectedDistrict(d === selectedDistrict ? null : d)}
                                className={styles.districtPoint}
                                style={{ cursor: 'pointer' }}
                            >
                                <circle r={4} className={`${styles.point} ${styles.pointActive} ${(selectedDistrict?.name === d.name) ? styles.pointSelected : ''}`} />
                                {(hoveredDistrict?.name === d.name || selectedDistrict?.name === d.name) && (
                                    <circle r={10} className={styles.pointPulse} />
                                )}
                            </g>
                        </Marker>
                    ))}
                </ComposableMap>

                {(hoveredDistrict || selectedDistrict) && (
                    <div className={styles.tooltipBox}>
                        <h4 className={styles.tooltipName}>{(hoveredDistrict || selectedDistrict)?.name}</h4>
                        <div className={styles.tooltipText}>
                            <div className={styles.subprojectCount}>{(hoveredDistrict || selectedDistrict)?.subprojects.length} Active {(hoveredDistrict || selectedDistrict)?.subprojects.length === 1 ? 'Project' : 'Projects'}</div>
                            <ul className={styles.subList}>
                                {(hoveredDistrict || selectedDistrict)?.subprojects.slice(0, 4).map((s, i) => (
                                    <li key={i}>
                                        <Link href={`/our-projects/${s.project_slug}/${s.slug}`} className={styles.subLinkInline}>
                                            {s.title}
                                        </Link>
                                    </li>
                                ))}
                                {(hoveredDistrict || selectedDistrict) && (hoveredDistrict || selectedDistrict)!.subprojects.length > 4 && <li>+ {(hoveredDistrict || selectedDistrict)!.subprojects.length - 4} more</li>}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.infoBox}>
                {(hoveredDistrict || selectedDistrict) ? (
                    <div className={styles.details}>
                        <h3 className={styles.detailsTitle}>{(hoveredDistrict || selectedDistrict)?.name} District</h3>
                        <p className={styles.detailsContent}>
                            We are currently running {(hoveredDistrict || selectedDistrict)?.subprojects.length} sub-projects in this region:
                        </p>
                        <div className={styles.activePills}>
                            {(hoveredDistrict || selectedDistrict)?.subprojects.map((s, i) => (
                                <Link key={i} href={`/our-projects/${s.project_slug}/${s.slug}`} className={styles.pillLink}>
                                    <span className={styles.pill}>{s.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className={styles.infoPlaceholder}>Select a highlighted district on the map to view impact details.</p>
                )}
            </div>
        </div>
    );
}
