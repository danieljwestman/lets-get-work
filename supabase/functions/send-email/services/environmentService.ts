
interface EnvironmentValidation {
  isValid: boolean;
  missingVars?: string[];
  CONTACT_EMAIL?: string;
  COMPANY_WEBSITE?: string;
  DEFAULT_SENDER_NAME?: string;
}

export function validateEnvironment(): EnvironmentValidation {
  const CONTACT_EMAIL = Deno.env.get('CONTACT_EMAIL');
  const COMPANY_WEBSITE = Deno.env.get('COMPANY_WEBSITE');
  const DEFAULT_SENDER_NAME = Deno.env.get('DEFAULT_SENDER_NAME');

  const missingVars = [];
  if (!CONTACT_EMAIL) missingVars.push('CONTACT_EMAIL');
  if (!COMPANY_WEBSITE) missingVars.push('COMPANY_WEBSITE');
  if (!DEFAULT_SENDER_NAME) missingVars.push('DEFAULT_SENDER_NAME');

  if (missingVars.length > 0) {
    return { isValid: false, missingVars };
  }

  return {
    isValid: true,
    CONTACT_EMAIL,
    COMPANY_WEBSITE,
    DEFAULT_SENDER_NAME
  };
}
