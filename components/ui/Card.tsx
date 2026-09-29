import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-white rounded-lg p-4 my-2 shadow-md ${className}`}>
      {children}
    </View>
  );
}
