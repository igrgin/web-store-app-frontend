import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../service/auth/auth.service";
import {StorageService} from "../service/storage/storage.service";

@Component({
  selector: 'app-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.css']
})
export class MenuViewComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private storageService: StorageService, private authService: AuthService) {
  }

  ngOnInit() {
   this.alterMenuBar()
   this.authService.onLoginStatusChange.subscribe(() => this.alterMenuBar());
  }

  alterMenuBar()
  {
    this.items = [{
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: "/home"
    },
      {label: 'Search', icon: 'pi pi-fw pi-search', routerLink: "/search"},
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
