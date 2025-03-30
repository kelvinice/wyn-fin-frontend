import { useContext } from 'react';
import { AppSettingsContext } from '~/context/app-settings-context';

export function useCurrency() {
  const { settings } = useContext(AppSettingsContext);
  return settings?.currency || 'IDR';
}