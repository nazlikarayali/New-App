import us from '../../assets/flags/us.svg';
import tr from '../../assets/flags/tr.svg';
import fr from '../../assets/flags/fr.svg';
import es from '../../assets/flags/es.svg';
import de from '../../assets/flags/de.svg';

export const FLAG_MAP: Record<string, string> = {
  us,
  tr,
  fr,
  es,
  de,
};

export function resolveFlag(code?: string): string | undefined {
  if (!code) return undefined;
  return FLAG_MAP[code.toLowerCase()];
}
