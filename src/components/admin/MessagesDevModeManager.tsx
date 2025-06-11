
import React from 'react';
import { MessagesDemoManager } from './MessagesDemoManager';

interface MessagesDevModeManagerProps {
  isDev: boolean;
  onDataChange: () => void;
}

export const MessagesDevModeManager: React.FC<MessagesDevModeManagerProps> = ({
  isDev,
  onDataChange
}) => {
  if (!isDev) return null;

  return <MessagesDemoManager onDataChange={onDataChange} />;
};
