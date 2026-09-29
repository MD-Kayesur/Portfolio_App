import { View, ActivityIndicator } from 'react-native';

export function Loading() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
