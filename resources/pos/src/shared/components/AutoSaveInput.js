import React from 'react';
import { Form } from 'react-bootstrap-v5';

/**
 * Auto-save enabled input component
 * @param {string} name - Input name
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} type - Input type (default: 'text')
 * @param {string} placeholder - Placeholder text
 * @param {string} className - CSS classes
 * @param {boolean} autoFocus - Auto focus flag
 * @param {object} ...props - Other props to pass to input
 */
const AutoSaveInput = ({
    name,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    className = 'form-control',
    autoFocus = false,
    ...props
}) => {
    const handleChange = (e) => {
        // Call the parent onChange handler
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <input
            type={type}
            name={name}
            value={value || ''}
            placeholder={placeholder}
            className={className}
            autoFocus={autoFocus}
            onChange={handleChange}
            {...props}
        />
    );
};

/**
 * Auto-save enabled textarea component
 */
const AutoSaveTextarea = ({
    name,
    value,
    onChange,
    placeholder = '',
    className = 'form-control',
    rows = 3,
    ...props
}) => {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <textarea
            name={name}
            value={value || ''}
            placeholder={placeholder}
            className={className}
            rows={rows}
            onChange={handleChange}
            {...props}
        />
    );
};

/**
 * Auto-save enabled select component
 */
const AutoSaveSelect = ({
    name,
    value,
    onChange,
    options = [],
    className = 'form-control',
    placeholder = 'Select an option',
    ...props
}) => {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <select
            name={name}
            value={value || ''}
            className={className}
            onChange={handleChange}
            {...props}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export { AutoSaveInput, AutoSaveTextarea, AutoSaveSelect };
export default AutoSaveInput;
