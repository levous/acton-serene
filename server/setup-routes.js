const path = require('path');
const fs = require('fs');
const log = {info: function(){console.log.apply(null, arguments)}};

var setupRoutes = function (directoryPath, app){
  console.log('(***********)');
  const routesBasePath = path.join(__dirname, './routes');
  // load each file in the routes dir
  // dynamically include routes (Controllers)
  let indexFound = false;

  fs.readdirSync(directoryPath).forEach(function (fileOrDir){
    const fullPath = path.join(directoryPath, fileOrDir);

    if(fullPath.substr(-3) === '.js') {
      // dynamically load route
      const route = require(fullPath);

      const basePath = fullPath.substr(routesBasePath.length, fullPath.length - routesBasePath.length - 3);
      if(basePath.substr(-6) === '/index'){
        indexFound = true;
        // index last as it may have overridden paths
      }else{
        log.info('********* Setup Route:', fullPath, 'base:', basePath);
        route.setup(basePath, app);
      }
    }else{
      // directory? recurse
      let pathStat = fs.statSync(fullPath);
      if(pathStat.isDirectory){
        setupRoutes(fullPath, app);
      }
    }
  });
  // defered index until last
  if(indexFound) {
    const fullPath = path.join(directoryPath, 'index.js');
    const basePath = fullPath.substr(routesBasePath.length, fullPath.length - routesBasePath.length - 9); //remove /index.js
    const route = require(fullPath);
    log.info('********* Setup INDEX Route:', fullPath, 'base:', basePath);
    route.setup(basePath, app);
  }
}

module.exports = setupRoutes;
