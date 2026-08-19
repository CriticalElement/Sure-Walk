import {
  ConfigPlugin,
  createRunOncePlugin,
  withAndroidManifest,
} from "expo/config-plugins";

const withSecretsManifest: ConfigPlugin = (config) => {
  const metadataName = "com.google.android.geo.API_KEY";

  return withAndroidManifest(config, async (modConfig) => {
    const androidManifest = modConfig.modResults;
    const mainApplication = (androidManifest.manifest.application ?? [])[0];

    // Ensure application metadata array exists
    if (!mainApplication["meta-data"]) {
      mainApplication["meta-data"] = [];
    }

    // Check if the metadata tag already exists to prevent duplicates
    const existingIndex = mainApplication["meta-data"].findIndex(
      (item) => item.$["android:name"] === metadataName,
    );

    const newMetaDataItem = {
      $: {
        "android:name": metadataName,
        "android:value": `\${GOOGLE_MAPS_SDK_API_KEY}`,
      },
    };

    if (existingIndex !== -1) {
      // Overwrite if it already exists
      mainApplication["meta-data"][existingIndex] = newMetaDataItem;
    } else {
      // Push new metadata tag if missing
      mainApplication["meta-data"].push(newMetaDataItem);
    }

    return modConfig;
  });
};

module.exports = createRunOncePlugin(
  withSecretsManifest,
  "withSecretsManifest",
  "1.0.0",
);
