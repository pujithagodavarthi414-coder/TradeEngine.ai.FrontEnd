const fs = require('fs-extra');
const concat = require('concat');

build = async () => {
    try {
        const files = [
            'dist/PDF-and-HTML-Designer/runtime.js',
            'dist/PDF-and-HTML-Designer/polyfills.js',
            // 'dist/PDF-and-HTML-Designer/scripts.js',
            'dist/PDF-and-HTML-Designer/main.js',
        ];
        await fs.ensureDir('web-component-scripts');
        await concat(files, 'web-component-scripts/pdf-designer-webcomponent.js');
    } catch (e) {
        console.log('Error happend while concatinating: ', e.message)
    }
}
build();