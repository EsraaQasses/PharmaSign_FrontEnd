import React from 'react';
import { View, StyleSheet } from 'react-native';
import BrandLogo from './BrandLogo';

/**
 * LogoCard - A standard white card container for the PharmaSign logo.
 * Used in Splash, Login, Register, and Role Selection screens.
 */
export default function LogoCard({ 
  size = 180, 
  cardSize = null,
  borderRadius = 24,
  padding = 16,
  style 
}) {
  return (
    <View 
      style={[
        styles.logoCard, 
        { 
          borderRadius, 
          padding,
          width: cardSize,
          height: cardSize
        }, 
        style
      ]}
    >
      <BrandLogo width={size} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  logoCard: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
