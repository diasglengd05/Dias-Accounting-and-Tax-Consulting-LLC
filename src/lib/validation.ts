/**
 * Form validation utilities for contact and consultation booking forms
 * Dias Accounting & Tax Advisory (UAE)
 */

// RFC 5322 compliant simplified email regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone character filter: allows optional single leading '+', digits, and common separators
const PHONE_CHARS_REGEX = /^\+?[0-9\s\-().]{7,25}$/;

/**
 * Validates whether an email string has a valid email format.
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  // Disallow double dots in local or domain part
  if (trimmed.includes("..")) return false;
  return EMAIL_REGEX.test(trimmed);
}

/**
 * Validates whether a phone string contains a valid phone number.
 * Accommodates UAE mobile/landline numbers, GCC numbers, and international E.164 formats (7 to 15 digits).
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;
  const trimmed = phone.trim();

  // Basic character validity check (no letters or unauthorized symbols)
  if (!PHONE_CHARS_REGEX.test(trimmed)) return false;

  // Extract pure digits
  const digits = trimmed.replace(/\D/g, "");

  // ITU-T E.164 standard: minimum 7 digits (e.g. small local landlines), maximum 15 digits
  if (digits.length < 7 || digits.length > 15) {
    return false;
  }

  // Reject dummy repeating digits (e.g., "0000000", "1111111111")
  if (/^(\d)\1+$/.test(digits) && digits.length >= 7) {
    return false;
  }

  // Reject sequential runs of dummy numbers (e.g., "1234567", "0123456")
  if (digits === "1234567" || digits === "12345678" || digits === "123456789" || digits === "0123456789") {
    return false;
  }

  return true;
}

/**
 * Detailed email validator returning a localized message.
 */
export function validateEmailField(email: string, language: "en" | "ar" = "en"): { isValid: boolean; error?: string } {
  const trimmed = email ? email.trim() : "";
  if (!trimmed) {
    return {
      isValid: false,
      error: language === "ar" ? "البريد الإلكتروني مطلوب" : "Email address is required.",
    };
  }
  if (!isValidEmail(trimmed)) {
    return {
      isValid: false,
      error: language === "ar"
        ? "يرجى إدخال بريد إلكتروني صحيح (مثال: name@company.ae)"
        : "Please enter a valid email format (e.g., name@company.ae).",
    };
  }
  return { isValid: true };
}

/**
 * Detailed phone validator returning a localized message.
 */
export function validatePhoneField(phone: string, language: "en" | "ar" = "en"): { isValid: boolean; error?: string } {
  const trimmed = phone ? phone.trim() : "";
  if (!trimmed) {
    return {
      isValid: false,
      error: language === "ar" ? "رقم الهاتف / الواتساب مطلوب" : "Phone / WhatsApp number is required.",
    };
  }
  if (!isValidPhoneNumber(trimmed)) {
    return {
      isValid: false,
      error: language === "ar"
        ? "يرجى إدخال رقم هاتف صحيح (7-15 رقماً، مثال: 4567 123 50 971+)"
        : "Please enter a valid phone number (7-15 digits, e.g., +971 50 123 4567).",
    };
  }
  return { isValid: true };
}

export interface ContactValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    phone?: string;
    general?: string;
  };
}

/**
 * Comprehensive contact form validation.
 */
export function validateContactForm(
  data: { name?: string; email: string; phone: string },
  language: "en" | "ar" = "en"
): ContactValidationResult {
  const errors: { name?: string; email?: string; phone?: string; general?: string } = {};

  if (data.name !== undefined) {
    const trimmedName = data.name.trim();
    if (!trimmedName) {
      errors.name = language === "ar" ? "الاسم الكامل مطلوب" : "Full name is required.";
    } else if (trimmedName.length < 2) {
      errors.name = language === "ar" ? "الاسم قصير جداً (حرفان على الأقل)" : "Name must be at least 2 characters.";
    }
  }

  const emailRes = validateEmailField(data.email, language);
  if (!emailRes.isValid && emailRes.error) {
    errors.email = emailRes.error;
  }

  const phoneRes = validatePhoneField(data.phone, language);
  if (!phoneRes.isValid && phoneRes.error) {
    errors.phone = phoneRes.error;
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    errors.general = language === "ar" 
      ? "يرجى تصحيح الأخطاء الموضحة أدناه قبل الإرسال."
      : "Please correct the errors indicated below before submitting.";
  }

  return { isValid, errors };
}
