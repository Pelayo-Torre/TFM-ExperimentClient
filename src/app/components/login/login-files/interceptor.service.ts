import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Location } from '@angular/common';
import {catchError} from 'rxjs/internal/operators';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

const header = 'Authorization';

@Injectable()
export class Interceptor implements HttpInterceptor {

    location: Location;

    constructor(
        location: Location,
        private token: TokenService,
        private route: Router
    ) { 
        this.location = location;
    }

    /**
     * Método de la clase HttpInterceptor encargado de interceptar los tokens
     * @param req 
     * @param next 
     */
    intercept(req: HttpRequest<any>, next: HttpHandler)  {
        var req2 = req;
        const token = this.token.getToken();

        if (token != null) {
            req2 = req.clone({headers:req.headers.set(header, 'Bearer ' + token) });
        }
        
        //return next.handle(req2);
        //return next.handle(req2).pipe(catchError);
        return next.handle(req2).pipe(
            catchError(error => {
            
            //Un 403 significa que el usuario no tiene permisos sobre un recurso
            if (error.status === 403) {
                this.route.navigate(['/experiments'], { queryParams: { err: '403' } });
            }
              return next.handle(req2);
            })
          );
    }
}
//Exporta el interceptor que se encarga de interceptar el envío de tokens entre el cliente y el servidor
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }
];