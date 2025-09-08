// Stub file for BaseHub RichText component
import React from 'react';

export interface RichTextProps {
  content?: any;
  children?: React.ReactNode;
  [key: string]: any;
}

export const RichText: React.FC<RichTextProps> = ({ content, children, ...props }) => {
  if (content && typeof content === 'string') {
    return React.createElement('div', { ...props, dangerouslySetInnerHTML: { __html: content } });
  }

  if (content && typeof content === 'object') {
    return React.createElement('div', props, JSON.stringify(content));
  }

  return React.createElement('div', props, children || 'Content not available');
};
