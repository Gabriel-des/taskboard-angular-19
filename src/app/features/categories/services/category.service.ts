import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {

	private readonly apiUrl = environment.apiUrl;

	private readonly httpClient = inject(HttpClient);

	private readonly categories$: Observable<Category[]> = this.httpClient
	.get<Category[]>(`${this.apiUrl}/categories`);

	public categories: Signal<Category[]> = toSignal(this.categories$, {
		initialValue: [] as Category[]
	});

}
