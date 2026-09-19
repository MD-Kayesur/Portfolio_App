import { View, Text } from 'react-native';

interface ErrorProps {
  message?: string;
}

export function Error({ message = 'Something went wrong' }: ErrorProps) {
  return (
    <View className="p-5 items-center">
      <Text className="text-danger text-base">{message}</Text>
    </View>
  );
}
