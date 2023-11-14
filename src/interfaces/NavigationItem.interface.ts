import { NavigationSubItemInterface } from '@/interfaces/NavigationSubItem.interface';
import { Views } from '@/views';

export interface NavigationItemInterface {
  icon: string;
  title: string;
  routerName: Views;
  // dropdownOptions are not needed now, but maybe later
  dropdownOptions: NavigationSubItemInterface[];
  projectRequired?: boolean;
  props?: string[];
  url?: string;
}
