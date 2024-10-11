"use client";

import React from 'react';
import styles from './Button.module.css';
import Text from '@/components/text';

const buttonTypes = {
  primary: styles.primary,
  secondary: styles.secondary,
  disabled: styles.disabled,
  delete: styles.delete,
};

export default function Button({ text = 'Click me', onClick, type = 'primary', height = '51px', width = '131px', style = {} }) {
  const buttonStyle = buttonTypes[type] || styles.primary;

  const getTextColor = () => {
    switch (type) {
      case 'primary':
        return "#FFFFFF";
      case 'secondary':
        return "#4B9460";
      case 'disabled':
        return "#BDBDBD";
      case 'delete':
        return "#FFFFFF";
      default:
        return "#FFFFFF";
    }
  };

  return (
    <div
      className={`${styles.touchableOpacity} ${buttonStyle}`}
      onClick={type !== 'disabled' ? onClick : undefined}
      style={{ ...style, height, width }}
    >
      <Text weight='600' color={getTextColor()}>{text}</Text>
    </div>
  );
}
