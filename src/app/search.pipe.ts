import { Pipe, PipeTransform } from '@angular/core';
import { Item } from './shared/services/item.service';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {
  transform(items: Item[], term: string): Item[] {
    term = term.toLowerCase();
    return term
      ? items.filter(
          item =>
            item.name.toLowerCase().includes(term) ||
            item.categoryID.toLowerCase().includes(term)
        )
      : items;
  }
}

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
  transform(items: any[], sortedBy: string): any {
    return items.sort((a, b) => {
      return b[sortedBy] - a[sortedBy];
    });
  }
}
