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

  constructor(private storageService: StorageService, private authService: AuthService, private router: Router,
              private categoryService: CategoryService) {
  }

  ngOnInit() {

      this.items = [{
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: "/home"
      }, {label: 'Cart', icon: 'pi pi-fw pi-shopping-cart', routerLink: "/user/cart"}];

      if (this.categories.length == 0) this.refreshMenubarCategories()

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

    this.authService.onLoginStatusChange.subscribe(value => this.refreshMenubarLoginState(value));
  }

  refreshMenubarCategories() {
    this.categories = []
    this.categoryService.getTopLevelCategories().subscribe(res => {
      res.forEach(cat => {
        this.categories.push({
          label: `${cat.name}`,
          routerLink: `/search/${cat.name}`,
        })
      })
        this.items.splice(1, 0, ...this.categories)
    })
  }

  logout(): any {
    if(this.storageService.isLoggedIn()){
    this.authService.logout().subscribe({
      error: err => {
        console.log(err);
      }
    });

    let index = this.items.indexOf({
      label: 'My profile',
      icon: 'pi pi-fw pi-user',
      items: [{label: 'My Transactions', icon: 'pi pi-fw pi-credit-card', routerLink: "profile/transactions"}, {
        label: 'logout', icon: 'pi pi-fw pi-sign-out', command: () => {
          this.logout();
        }
      },]
    });

    this.items.splice(index, 1);
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

  private refreshMenubarLoginState(isLoggedIn: boolean) {
    return isLoggedIn ? this.login() : this.logout();
  }

  private login() {
    let index = this.items.indexOf({
      label: 'register',
      icon: 'pi pi-fw pi-user-plus',
      routerLink: 'register'
    });
    this.items.splice(index, 1);
    index = this.items.indexOf({
      label: 'login',
      icon: 'pi pi-fw pi-sign-in',
      routerLink: 'login'
    });
    this.items.splice(index, 1);
    this.items.push({
      label: 'My profile',
      icon: 'pi pi-fw pi-user',
      items: [{label: 'My Transactions', icon: 'pi pi-fw pi-credit-card', routerLink: "profile/transactions"}, {
        label: 'logout', icon: 'pi pi-fw pi-sign-out', command: () => {
          this.logout();
        }
      },]
    })
  }
}
