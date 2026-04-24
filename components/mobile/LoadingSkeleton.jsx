import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

/**
 * Skeleton — a loading placeholder with shimmer animation.
 */
export function Skeleton({ className = "", width, height, borderRadius = 8 }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#E5E7EB",
          opacity,
        },
      ]}
      className={className}
    />
  );
}

/**
 * CardSkeleton — skeleton for a card-like loading state.
 */
export function CardSkeleton() {
  return (
    <View className="bg-white rounded-xl p-4 gap-3 border border-gray-100">
      <View className="flex-row items-center gap-3">
        <Skeleton width={48} height={48} borderRadius={12} />
        <View className="flex-1 gap-2">
          <Skeleton width="70%" height={14} />
          <Skeleton width="40%" height={12} />
        </View>
      </View>
      <Skeleton width="100%" height={10} />
      <Skeleton width="60%" height={10} />
    </View>
  );
}

/**
 * ListSkeleton — multiple card skeletons.
 */
export function ListSkeleton({ count = 3 }) {
  return (
    <View className="gap-3 px-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

export default Skeleton;