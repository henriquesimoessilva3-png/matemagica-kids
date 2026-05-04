/**
 * Cota grátis: usuário tem N estudos antes de bater no paywall.
 * Admin tem cota ilimitada.
 *
 * Quando tiver pagamento integrado:
 *   - tabela `subscriptions` com phone + plan + valid_until
 *   - hasActivePlan(phone) bypassa cota
 */
import { countStudies } from './state.js';
import { isAdmin } from './utils.js';

export function quotaInfo(phone) {
  if (isAdmin(phone)) return { used: 0, limit: Infinity, remaining: Infinity, blocked: false };

  const limit = parseInt(process.env.FREE_QUOTA || '3', 10);
  const used = countStudies(phone);
  const remaining = Math.max(0, limit - used);
  return { used, limit, remaining, blocked: remaining === 0 };
}
