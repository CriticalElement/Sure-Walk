import {
  ConfigPlugin,
  createRunOncePlugin,
  withAppBuildGradle,
  withProjectBuildGradle,
} from "expo/config-plugins";

// 1. Modify the project-level root build.gradle to add the buildscript classpath dependency
const withProjectSecretsClasspath: ConfigPlugin = (config) => {
  return withProjectBuildGradle(config, (modConfig) => {
    if (modConfig.modResults.language === "groovy") {
      let content = modConfig.modResults.contents;

      // Ensure we don't duplicate the dependency on multiple prebuilds
      if (!content.includes("secrets-gradle-plugin")) {
        const searchString = "dependencies {";
        const stringToInject = `\n        classpath("com.google.android.libraries.mapsplatform.secrets-gradle-plugin:secrets-gradle-plugin:2.0.1")`;

        const index = content.indexOf(searchString);
        if (index !== -1) {
          content =
            content.slice(0, index + searchString.length) +
            stringToInject +
            content.slice(index + searchString.length);
          modConfig.modResults.contents = content;
        }
      }
    }
    return modConfig;
  });
};

// 2. Modify the app-level build.gradle to apply the plugin ID
const withAppSecretsPluginId: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (modConfig) => {
    if (modConfig.modResults.language === "groovy") {
      let content = modConfig.modResults.contents;

      if (
        !content.includes(
          "com.google.android.libraries.mapsplatform.secrets-gradle-plugin",
        )
      ) {
        const searchString = 'apply plugin: "com.android.application"';
        const stringToInject = `\napply plugin: "com.google.android.libraries.mapsplatform.secrets-gradle-plugin"`;

        const index = content.indexOf(searchString);
        if (index !== -1) {
          content =
            content.slice(0, index + searchString.length) +
            stringToInject +
            content.slice(index + searchString.length);
          modConfig.modResults.contents = content;
        }
      }
    }
    return modConfig;
  });
};

// Combine the modifiers and export the config plugin
const withSecretsGradlePlugin: ConfigPlugin = (config) => {
  return withProjectSecretsClasspath(withAppSecretsPluginId(config));
};

module.exports = createRunOncePlugin(
  withSecretsGradlePlugin,
  "withSecretsGradlePlugin",
  "1.0.0",
);
