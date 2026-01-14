import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  // Validadores customizados
  static emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = emailRegex.test(control.value);

      return valid ? null : { invalidEmail: true };
    };
  }

  static phoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const phoneRegex = /^[\d\s\-\(\)]+$/;
      const valid = phoneRegex.test(control.value) && control.value.replace(/\D/g, '').length >= 10;

      return valid ? null : { invalidPhone: true };
    };
  }

  static priceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const price = parseFloat(control.value);
      const valid = !isNaN(price) && price > 0;

      return valid ? null : { invalidPrice: true };
    };
  }

  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const password = control.value;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumeric = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      const isLongEnough = password.length >= 8;

      const valid = hasUpperCase && hasLowerCase && hasNumeric && isLongEnough;

      return valid ? null : { weakPassword: true };
    };
  }

  static matchPasswordValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }

  static minLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      return control.value.length >= minLength ? null : { minLength: { requiredLength: minLength } };
    };
  }

  static maxLengthValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      return control.value.length <= maxLength ? null : { maxLength: { requiredLength: maxLength } };
    };
  }

  // Mensagens de erro
  getErrorMessage(error: ValidationErrors | null, fieldName: string): string {
    if (!error) {
      return '';
    }

    if (error['required']) {
      return `${fieldName} é obrigatório`;
    }
    if (error['invalidEmail']) {
      return 'Email inválido';
    }
    if (error['invalidPhone']) {
      return 'Telefone inválido (mínimo 10 dígitos)';
    }
    if (error['invalidPrice']) {
      return 'Preço deve ser um valor positivo';
    }
    if (error['weakPassword']) {
      return 'Senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números';
    }
    if (error['passwordMismatch']) {
      return 'As senhas não correspondem';
    }
    if (error['minLength']) {
      return `${fieldName} deve ter no mínimo ${error['minLength'].requiredLength} caracteres`;
    }
    if (error['maxLength']) {
      return `${fieldName} deve ter no máximo ${error['maxLength'].requiredLength} caracteres`;
    }
    if (error['pattern']) {
      return `${fieldName} tem formato inválido`;
    }

    return 'Campo inválido';
  }

  // Validar objeto completo
  validateObject(obj: any, rules: Record<string, ValidatorFn[]>): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const field in rules) {
      const value = obj[field];
      const validators = rules[field];

      for (const validator of validators) {
        const control = { value } as AbstractControl;
        const error = validator(control);

        if (error) {
          errors.push({
            field,
            message: this.getErrorMessage(error, field),
            type: Object.keys(error)[0],
          });
        }
      }
    }

    return errors;
  }

  // Validar email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validar telefone
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  // Validar preço
  isValidPrice(price: any): boolean {
    const numPrice = parseFloat(price);
    return !isNaN(numPrice) && numPrice > 0;
  }

  // Validar URL
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

