module.exports = {
  // This tells Next.js not to output source maps for the browser
  productionBrowserSourceMaps: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.devtool = false; // turn off JavaScript source maps in production
    }
    return config;
  },
}; 