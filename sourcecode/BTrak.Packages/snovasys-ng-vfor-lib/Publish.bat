CALL npm set registry http://npm.snovasys.io
C:
CD C:\Projects\BTrak.Packages

CD C:\Projects\BTrak.Packages\snovasys-ng-vfor-lib
CALL git pull
CALL npm install
CD C:\Projects\BTrak.Packages\snovasys-ng-vfor-lib\projects\ng-vfor-lib
CALL npm version patch
CD C:\Projects\BTrak.Packages\snovasys-ng-vfor-lib
CALL npm run build
CALL npm publish dist\project-components
CALL git add -A
CALL git commit -m "commit by the publish script"
CALL git push
