import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap-v5';
import { getFormattedMessage } from '../sharedMethod';

/**
 * Component to show notification when saved form data is available
 * @param {boolean} hasSavedData - Whether there's saved data available
 * @param {function} onRestore - Function to call when user wants to restore data
 * @param {function} onDiscard - Function to call when user wants to discard saved data
 * @param {string} formName - Name of the form for display purposes
 */
const AutoSaveNotification = ({ 
    hasSavedData, 
    onRestore, 
    onDiscard, 
    formName = 'form' 
}) => {
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (hasSavedData) {
            setShowNotification(true);
        }
    }, [hasSavedData]);

    const handleRestore = () => {
        onRestore();
        setShowNotification(false);
    };

    const handleDiscard = () => {
        onDiscard();
        setShowNotification(false);
    };

    const handleDismiss = () => {
        setShowNotification(false);
    };

    if (!showNotification || !hasSavedData) {
        return null;
    }

    return (
        <Alert 
            variant="info" 
            dismissible 
            onClose={handleDismiss}
            className="mb-3"
        >
            <Alert.Heading className="h6">
                <i className="fas fa-save me-2"></i>
                Saved Data Found
            </Alert.Heading>
            <p className="mb-3">
                {`We found previously saved data for this ${formName}. Would you like to restore it?`}
            </p>
            <div className="d-flex gap-2">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRestore}
                >
                    <i className="fas fa-undo me-1"></i>
                    Restore Data
                </Button>
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleDiscard}
                >
                    <i className="fas fa-trash me-1"></i>
                    Start Fresh
                </Button>
            </div>
        </Alert>
    );
};

export default AutoSaveNotification;
