const fs = require('fs-extra');
const concat = require('concat');

build = async () => {
    try {
        const files = [
            'dist/workflows/runtime.js',
            'dist/workflows/polyfills.js',
            //'dist/angular-formio-web-component/es2015-polyfills.js',
            'dist/workflows/scripts.js',
            'dist/workflows/main.js',
        ];
        await fs.ensureDir('web-component-scripts');
        await concat(files, 'web-component-scripts/workflow-web-components.js');
    } catch (e) {
        console.log('Error happend while concatinating: ', e.message)
    }
}
build();