import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import Theme from '../constants/Theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: any;
}

export default function Input({
  label,
  error,
  icon,
  rightIcon,
  containerStyle,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          style={[styles.input, icon ? styles.inputWithLeftIcon : null]}
          placeholderTextColor={Colors.neutral[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.white,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border.light,
    paddingHorizontal: Theme.spacing.md,
  },
  inputContainerFocused: {
    borderColor: Colors.primary[500],
  },
  inputContainerError: {
    borderColor: Colors.danger[500],
  },
  input: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Colors.text.inverse,
    paddingVertical: Theme.spacing.md,
  },
  inputWithLeftIcon: {
    marginLeft: Theme.spacing.sm,
  },
  iconLeft: {
    marginRight: Theme.spacing.xs,
  },
  iconRight: {
    marginLeft: Theme.spacing.xs,
  },
  error: {
    fontSize: Theme.fontSize.xs,
    color: Colors.danger[500],
    marginTop: Theme.spacing.xs,
    marginLeft: Theme.spacing.xs,
  },
});
