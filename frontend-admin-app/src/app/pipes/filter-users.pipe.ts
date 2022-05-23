import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {
	transform(items: any[], searchText: string): any[] {
		if (!items) {
			return [];
		}

		if (!searchText) {
			return items;
		}

		searchText = searchText.toLowerCase();

		items.forEach((element) => {
			Object.entries(element).forEach(([ key, value ]) => {
				if (key === 'optionals' || key === 'formElementOptions') {
					const aux: any = value;
					for (let i = 0; i < aux.length; i++) {
						element[value[i].title] = value[i].title;
						element[value[i].value] = value[i].value;
					}
				}
			});
		});

		return items.filter((item) => {
			return Object.keys(item).some((k) => {
				return item[k] != null && item[k].toString().toLowerCase().includes(searchText.toLowerCase());
			});
		});
	}
}
