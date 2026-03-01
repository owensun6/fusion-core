// <!-- Author: fe-ui-builder -->
import React from 'react';
import type { PatientCardProps } from '../domain/types';

export const PatientView: React.FC<PatientCardProps> = ({ patient }) => {
    return (
        <div className="medical-card">
            <h1>{patient.name}</h1>
            <p>ID: {patient.id}</p>
            <p>主诉: {patient.chiefComplaint}</p>
        </div>
    );
};
