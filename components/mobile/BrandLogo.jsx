import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

/**
 * BrandLogo - Displays the main PharmaSign logo using the official PNG asset.
 * 
 * @param {number} width - Width of the image.
 * @param {number} height - Height of the image.
 * @param {string} resizeMode - How the image should be scaled ('contain' recommended).
 * @param {object} style - Additional styles for the image.
 */
export default function BrandLogo({ width = 100, height = 100, resizeMode = 'contain', style }) {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      style={[
        {
          width: width,
          height: height,
        },
        style
      ]}
      resizeMode={resizeMode}
    />
  );
}
