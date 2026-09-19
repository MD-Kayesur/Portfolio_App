import { TextInput } from 'react-native';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  className?: string;
}

export function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  multiline,
  className = '',
}: InputProps) {
  return (
    <TextInput
      className={`border border-gray-300 rounded-lg p-3 my-1 text-base ${multiline ? 'min-h-[100px]' : ''} ${className}`}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
    />
  );
}
