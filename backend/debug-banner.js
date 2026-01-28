const fetch = require('node-fetch'); // Check if node-fetch is available, or use built-in global fetch if Node 18+

async function testBanner() {
    try {
        console.log("Attempting to create banner...");
        const response = await fetch('http://localhost:5000/api/banners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Test Banner',
                imageUrl: 'https://via.placeholder.com/150',
                isActive: true
            })
        });

        console.log("Status:", response.status);
        const data = await response.json(); // Use json() standard method
        console.log("Response:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

testBanner();
