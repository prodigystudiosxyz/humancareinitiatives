'use client';
import React, { useState } from 'react';
import styles from './ProjectsGrid.module.css';
import {
    Moon, CloudSnow, AlertTriangle, Users,
    Wheat, Droplets, ShieldPlus, Sprout, BookOpen
} from 'lucide-react';

interface ProjectCategory {
    id: string;
    title: string;
    description: string;
    color: string;
    icon: React.ReactNode;
}

const categories: ProjectCategory[] = [
    {
        id: 'ramadan',
        title: 'Ramadan',
        description: 'Provide food and essential support to families in need during the holy month of Ramadan.',
        color: '#121212',
        icon: <Moon size={40} className={styles.icon} />
    },
    {
        id: 'winter',
        title: 'Winter',
        description: 'Distribute blankets, winter clothes, and fuel to vulnerable communities to survive the harsh cold.',
        color: '#121212',
        icon: <CloudSnow size={40} className={styles.icon} />
    },
    {
        id: 'emergencies',
        title: 'Emergencies',
        description: 'Rapid response to natural disasters, providing urgent medical care, food, and shelter.',
        color: '#121212',
        icon: <AlertTriangle size={40} className={styles.icon} />
    },
    {
        id: 'child-welfare',
        title: 'Child Welfare & Orphans',
        description: 'Ensure safe housing, education, and health care for orphaned and vulnerable children.',
        color: '#121212',
        icon: <Users size={40} className={styles.icon} />
    },
    {
        id: 'food-security',
        title: 'Food Security',
        description: 'Sustainable agricultural programs and food distribution to combat hunger and malnutrition.',
        color: '#121212',
        icon: <Wheat size={40} className={styles.icon} />
    },
    {
        id: 'water-sanitation',
        title: 'Water & Sanitation',
        description: 'Build deep tube wells and sanitation facilities to provide clean, safe drinking water.',
        color: '#121212',
        icon: <Droplets size={40} className={styles.icon} />
    },
    {
        id: 'health-medical',
        title: 'Health & Medical',
        description: 'Mobile clinics, medical camps, and essential healthcare services for remote populations.',
        color: '#121212',
        icon: <ShieldPlus size={40} className={styles.icon} />
    },
    {
        id: 'livelihoods',
        title: 'Livelihoods',
        description: 'Skills training, microfinance, and resources to help families build sustainable incomes.',
        color: '#121212',
        icon: <Sprout size={40} className={styles.icon} />
    },
    {
        id: 'education',
        title: 'Education',
        description: 'Build schools, provide scholarships, and supply educational materials to empower the next generation.',
        color: '#121212',
        icon: <BookOpen size={40} className={styles.icon} />
    }
];

export default function ProjectsGrid() {
    const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});

    const toggleFlip = (id: string) => {
        setFlippedCards(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className={styles.gridContainer}>
            {categories.map((category) => (
                <div
                    key={category.id}
                    className={`${styles.card} ${flippedCards[category.id] ? styles.flipped : ''}`}
                    onClick={() => toggleFlip(category.id)}
                >
                    <div className={styles.cardInner}>
                        {/* Front of the card */}
                        <div
                            className={styles.cardFront}
                            style={{ backgroundColor: category.color }}
                        >
                            {category.icon}
                            <h3 className={styles.cardTitle}>{category.title}</h3>
                        </div>

                        {/* Back of the card */}
                        <div
                            className={styles.cardBack}
                            style={{ backgroundColor: category.color }}
                        >
                            <h3 className={styles.cardTitleBack}>{category.title}</h3>
                            <p className={styles.cardDescription}>{category.description}</p>
                            <button className={styles.learnMoreBtn}>Learn More</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
