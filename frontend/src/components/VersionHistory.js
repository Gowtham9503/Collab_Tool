import React from 'react';
import './VersionHistory.css';

const VersionHistory = ({ versions }) => {
    return (
        <div className="version-history">
            <h3>Version History</h3>
            <div className="version-list">
                {versions?.map((version, index) => (
                    <div key={index} className="version-item">
                        <span>Version {versions.length - index} -</span>
                        <span> {new Date(version.createdAt).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VersionHistory;