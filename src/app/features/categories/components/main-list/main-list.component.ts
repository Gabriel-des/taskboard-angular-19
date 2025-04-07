import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/category';

@Component({
	selector: 'app-main-list',
	standalone: true,
	imports: [],
	template: `
		<section class="mt-16 mx-12 pl-8">
			<span class="text-2xl font-semibold">Categorias</span>

			<ul class="mt-4 space-y-4">
				@for (category of categories(); track category.id) {
					<li class="select-none opacity-80 cursor-pointer hover:opacity-100 text-xl font-medium">{{ category.name }}</li>
				}
			</ul>
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainListComponent {

	private readonly categoryService: CategoryService = inject(CategoryService);

	public categories: Signal<Category[]> = this.categoryService.categories;
}
