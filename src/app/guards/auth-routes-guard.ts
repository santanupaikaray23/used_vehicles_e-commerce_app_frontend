import { CanActivateFn } from '@angular/router';

export const authRoutesGuard: CanActivateFn = (route, state) => {
  return true;
};
