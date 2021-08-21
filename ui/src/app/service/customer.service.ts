import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { ICustomer } from '../model/ICustomer';
import { BehaviorSubject, Observable } from 'rxjs';

import { AppConfigService } from './app-config.service';
import { map } from 'rxjs/operators';
import { KeyValuePipe } from '@angular/common';
import { IConfig } from '../model/IConfig';

@Injectable({
    providedIn: 'root'
})
export class CustomerService implements OnInit {

    private customerList = new BehaviorSubject<ICustomer[] | null>(null);
    customerList$ = this.customerList.asObservable();

    //Instead of getting from the configuration file, get from the Azure Function
    // readonly url = this.appConfig.get('apiCustomer');
    //private url: string = "https://localhost:44381/api/customer";
    private config: IConfig; 

    constructor(private http: HttpClient,
        private appConfig: AppConfigService) {
        
    };

    ngOnInit(){
        //get the API url by calling Azure Function
        this.http.get<IConfig>('api/settings').subscribe(
            config => {
                if (config) 
                    this.config = config
            }
        );
    }

    //get the list of customers
    get(): Observable<ICustomer[]> {
        this.http.get<ICustomer[]>(this.config.apiCustomer).pipe(
        ).subscribe(result => {
            if (result)
                this.customerList.next(result)
        });
        return this.customerList$;
    }

    //add customer
    add(customer: ICustomer) {
        this.http.post<ICustomer>(this.config.apiCustomer, customer).subscribe(data => {
            let customer = data;
            if (customer.customerId > 0)  //if customer added successfully
                this.get();  //update the list of customers
        });
    }

    //update customer
    update(customer: ICustomer) {
        this.http.put<ICustomer>(this.config.apiCustomer + '\\' + customer.customerId, customer).subscribe(data => {
            let customer = data;
            if (customer.customerId > 0)  //if customer updated successfully
                this.get();  //update the list of customers
        });
    }

    delete(customer: ICustomer) {
        this.http.delete<number>(this.config.apiCustomer + '\\' + customer.customerId).subscribe(data => {
            if (data > 0) //if deleted successfully
                this.get();  //update the list of customers
        });
    }

}