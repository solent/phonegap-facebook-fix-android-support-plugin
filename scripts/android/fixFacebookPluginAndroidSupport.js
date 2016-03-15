/**
 * This scripts fixes the inclusion of android-support-v4 in the facebookconnect plugin FacebookLib.
 * The fix implies two operations:
 * 1. Removing the android-support-v4 JAR file from FacebookLib/libs directory (whose content is referenced by the Gradle build script)
 * 2. Referencing 'com.android.support:support-v4:22.+' as a compile dependency in FacebookLib/build-extras.gradle
 */

var path = require('path'),
    fs = require('fs');

function pathExists(path) {
  try {
    fs.accessSync( path );
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = function fixFacebookPluginAndroidSupport(context) {

  console.log( JSON.stringify(context) );

  console.log("Fixing FacebookLib Android support.");

  var androidPlatformDir = path.join(context.opts.projectRoot, 'platforms', 'android' );
  var facebookLibDir = path.join( androidPlatformDir, 'com.phonegap.plugins.facebookconnect', 'ui-FacebookLib' );

  console.log("Deleting Android support JAR file from libs directory.");
  var facebookLibLibrariesDir = path.join( facebookLibDir, 'libs' );
  var androidSupportPath = path.join( facebookLibLibrariesDir, 'android-support-v4.jar' );

  if ( pathExists( androidSupportPath ) ) {
    fs.unlinkSync( androidSupportPath );
    console.info("Removed '%s'.", androidSupportPath );
  }
  else {
    console.info( "Not removing non-existing file '%s'.", androidSupportPath );
  }

  console.log("Setting up Android support compile time dependency for FacebookLib.");
  var facebookLibBuildExtrasPath = path.join( facebookLibDir, 'build-extras.gradle');
  fs.writeFileSync(facebookLibBuildExtrasPath, "dependencies { compile 'com.android.support:support-v4:22.+' }", { encoding: 'utf8' });
};
