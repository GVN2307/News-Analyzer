const axios = require('axios');

/**
 * Reverse geocoding using OpenStreetMap Nominatim.
 * Note: respects OpenStreetMap usage policy (1 request per second).
 */
async function reverseGeocode(lat, lon) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                format: 'jsonv2',
                lat: lat,
                lon: lon,
                'accept-language': 'en'
            },
            headers: {
                'User-Agent': 'NewsAnalyzer/1.0 (Educational Project)'
            }
        });

        if (response.data && response.data.address) {
            const addr = response.data.address;
            return {
                city: addr.city || addr.town || addr.village || addr.suburb || 'Unknown City',
                state: addr.state || 'Unknown State',
                country: addr.country || 'India'
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding Error:", error.message);
        return null;
    }
}

module.exports = { reverseGeocode };
