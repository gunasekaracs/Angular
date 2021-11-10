import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStatusErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modelStatusErrors.push(error.error.errors[key]);
                  }
                }
                throw modelStatusErrors.flat();
              }
              else {
                this.toastr.error(error.error, error.status);
              }
              break;
            case 401:              
              var message = error.error;
              console.log(message);
              if (message == null) message = "Unauthorized";
              this.toastr.error(message, error.status);
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigtionExtras: NavigationExtras = { state: { error: error.error } };
              this.router.navigateByUrl('/server-error', navigtionExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
          }
        }
        return throwError(error);
      })
    );
  }
}
