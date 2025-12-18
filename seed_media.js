const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api/media-collections';

async function seedData() {
    try {
        console.log('--- SEEDING DATA START ---');

        // Ensure dummy file exists
        const testFilePath = path.join(__dirname, 'test_hero_image.jpg');
        // Create a simple dummy text file pretending to be jpg for the test
        // Ideally we'd use a real image, but for checking src url, any file content works if backend accepts it.
        // Backend checks mimetype from request, which we set.
        fs.writeFileSync(testFilePath, 'dummy image content');

        const formData = new FormData();
        formData.append('title', 'Browser Verification Collection');
        formData.append('description', 'Seeded by Agent for testing');

        const buffer = fs.readFileSync(testFilePath);
        const blob = new Blob([buffer], { type: 'image/jpeg' });

        formData.append('files', blob, 'test_hero_image.jpg');

        console.log('Sending POST request...');
        const createRes = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!createRes.ok) {
            const err = await createRes.json();
            throw new Error(`Create failed: ${createRes.status} - ${err.message}`);
        }

        const createData = await createRes.json();
        console.log('Seed Success! Created Collection ID:', createData._id);

        // Use default defaults for "new" project so we dont have to guess port
        // But we will start frontend on port 5174 usually if 5173 is taken, or 5173.

        console.log('--- SEEDING COMPLETE ---');

    } catch (error) {
        console.error('Seed Failed:', error.message);
    }
}

seedData();
