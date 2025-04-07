import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { CategoryService } from '../../services/category.service';
import { categoryBackgroundColors } from '../../constants/category-colors';
import { Category } from '../../model/category';

const MODULES = [MatDivider]

@Component({
	selector: 'app-colors-list',
	standalone: true,
	imports: [...MODULES],
	template: `
		<section class="flex flex-col gap-4 w-full mt-4 h-auto mb-4">
			<mat-divider class="h-full opacity-50" />

			<div class="flex flex-wrap justify-center item-center px-4 gap-4">
				@for (category of categories(); track category.id) {
					<span class="select-none opacity-80 hover:opacity-100 cursor-pointer flex items-center justify-center {{categoryBackgroundColors[category.color]}} px-4 py-2 rounded-2xl w-[80px] text-center text-white font-semibold">
						{{category.name}}
					</span>
				}
			</div>
		</section>
  	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsListComponent {
	private readonly categoryService = inject(CategoryService);

	public categories: Signal<Category[]> = this.categoryService.categories;

	public categoryBackgroundColors = categoryBackgroundColors;
}
