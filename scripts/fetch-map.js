const fs = require('fs');

async function main() {
    const res = await fetch('https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/bangladesh.geojson');
    const geojson = await res.json();
    fs.writeFileSync('./bangladesh.geojson', JSON.stringify(geojson));
    console.log('Downloaded geojson. Features:', geojson.features ? geojson.features.length : 0);
}
main();
