import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../service/auth/auth.service";
import {StorageService} from "../service/storage/storage.service";
import {CategoryService} from "../service/category/category.service";

@Component({
  selector: 'app-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.css']
})
export class MenuViewComponent implements OnInit {
  items?: MenuItem[];
  mainCategories:MenuItem[] = [];

  constructor(private storageService: StorageService, private authService: AuthService, private categoryService: CategoryService) {
  }

  ngOnInit() {
   this.alterMenuBar()
   this.authService.onLoginStatusChange.subscribe(() => this.alterMenuBar());
  }

  alterMenuBar()
  {
    this.categoryService.getTopLevelCategories().subscribe(res => {
      res.forEach(cat => {
        this.mainCategories.push({
          label: `${cat.name}`,
          command: () => {
            console.log(`${cat.name}`)
          }
        })
      })
    })

    this.items = [{
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: "/home"
    },
      {label: 'Categories', icon: 'pi pi-fw pi-category', items: this.mainCategories},
      {label: 'Cart', icon: 'pi pi-fw pi-shopping-cart', routerLink: "/user/cart"}];

    if (this.storageService.isLoggedIn()) {
      this.items.push({
        label: 'My profile',
        icon: 'pi pi-fw pi-user',
        items: [{label: 'My Transactions', icon: 'pi pi-fw pi-credit-card', routerLink: "profile/transactions"}, {
          label: 'logout', icon: 'pi pi-fw pi-sign-out', command: () => {
            this.logout();
          }
        },]
      })
    } else {
      this.items.push(
        {
          label: 'register',
          icon: 'pi pi-fw pi-user-plus',
          routerLink: 'register'
        }, {
          label: 'login',
          icon: 'pi pi-fw pi-sign-in',
          routerLink: 'login'
        });
    }
  }

  logout(): any {
    this.authService.logout().subscribe({
      error: err => {
        console.log(err);
      }
    });
  }
}
