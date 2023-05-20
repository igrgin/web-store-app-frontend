import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../service/auth/auth.service";
import {StorageService} from "../service/storage/storage.service";
import {CategoryService} from "../service/category/category.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.css']
})
export class MenuViewComponent implements OnInit {
  items: MenuItem[] = [];
  categories: MenuItem[] = []

  constructor(private storageService: StorageService, private authService: AuthService, private router:Router, private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.items = [{
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: "/home"
    }, {label: 'Cart', icon: 'pi pi-fw pi-shopping-cart', routerLink: "/user/cart"}];

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
    if(this.categories.length == 0) this.refreshMenubar()

    this.authService.onLoginStatusChange.subscribe(() => this.refreshMenubar());
  }

  refreshMenubar() {
    this.categoryService.getTopLevelCategories().subscribe(res => {
      res.forEach(cat => {
        this.categories.push({
          label: `${cat.name}`,
          command: () => {
            this.router.navigate(['/search', {category:cat.id}])
          }
        })
      })
      console.log(this.categories)
      this.items.splice(1,0,...this.categories)
    })
  }

  logout(): any {
    this.authService.logout().subscribe({
      error: err => {
        console.log(err);
      }
    });
  }
}
