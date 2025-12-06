import fs from 'fs';
fs.writeFileSync('debug_output.txt', 'Starting debug...\n');

try {
    const { Project } = await import('./server/models/index.js');
    fs.appendFileSync('debug_output.txt', 'Models imported successfully.\n');
    fs.appendFileSync('debug_output.txt', 'Project: ' + (!!Project) + '\n');
} catch (e) {
    fs.appendFileSync('debug_output.txt', 'CRITICAL ERROR:\n' + e.message + '\n' + e.stack);
}
