import { useState } from 'react';
import { Form } from 'react-bootstrap';

function SelectCurrencyDropdown() {
    const [currency, setCurrency] = useState('USD');

    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    return (
        <Form.Select
            value={currency}
            onChange={handleCurrencyChange}
            aria-label="Currency select"
            style={{ width: 'auto', cursor: 'pointer' }}
        >
            <option value="USD">USD</option>
            <option value="PKR">PKR</option>
            <option value="AUS">AUS</option>
            <option value="EURO">EURO</option>
        </Form.Select>
    );
}

export default SelectCurrencyDropdown;
