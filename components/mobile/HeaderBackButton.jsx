import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * HeaderBackButton - A unified RTL back button for Arabic mobile app.
 * 
 * Two modes:
 * 1) Inline (default): renders as a normal button element. Parent must position it.
 * 2) Floating (floating=true): renders with position:absolute, top-right, 
 *    always appears in the correct RTL position regardless of parent layout.
 *
 * @param {string} fallback - The explicit route to navigate to (required for safe navigation).
 * @param {string} color - The icon color (defaults to patient dark blue #022451).
 * @param {boolean} floating - If true, positions itself absolutely at top-right.
 * @param {function} onPress - Optional custom press handler override.
 */
const HeaderBackButton = ({ fallback, color = "#022451", onPress, floating = false }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (fallback) {
      router.replace(fallback);
    } else {
      router.back();
    }
  };

  const button = (
    <TouchableOpacity
      onPress={handlePress}
      className="w-11 h-11 bg-white rounded-2xl items-center justify-center shadow-lg border border-white"
      activeOpacity={0.8}
    >
      <ArrowRight size={22} color={color} strokeWidth={2.5} />
    </TouchableOpacity>
  );

  if (floating) {
    return (
      <View
        style={{
          position: 'absolute',
          top: insets.top + 12,
          right: 16,
          zIndex: 999,
        }}
      >
        {button}
      </View>
    );
  }

  return button;
};

export default HeaderBackButton;
