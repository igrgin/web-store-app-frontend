import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../service/auth/auth.service";
import {StorageService} from "../service/storage/storage.service";
import {CategoryService} from "../service/category/category.service";
import {Router} from "@angular/router";
import {AuthGuard} from "../guard/auth.guard";
import {ToastService} from "../service/toast/toast.service";
import {AuthenticationInterceptor} from "../interceptor/authentication.interceptor";


@Component({
  selector: 'app-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: ['./menu-view.component.css']
})
export class MenuViewComponent implements OnInit {
  items: MenuItem[] = [];
  anonymousItems: MenuItem[] = [{
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    routerLink: "/home"
  }, {label: 'Cart', icon: 'pi pi-fw pi-shopping-cart', routerLink: "/cart"}, {
    label: 'register',
    icon: 'pi pi-fw pi-user-plus',
    routerLink: 'register'
  }, {
    label: 'login',
    icon: 'pi pi-fw pi-sign-in',
    routerLink: 'login'
  }]
  userItems: MenuItem[] = [{
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    routerLink: "/home"
  }, {label: 'Cart', icon: 'pi pi-fw pi-shopping-cart', routerLink: "/cart"}, {
    label: 'My profile',
    icon: 'pi pi-fw pi-user',
    items: [{label: 'My Transactions', icon: 'pi pi-fw pi-credit-card', routerLink: "profile/transactions"}, {
      label: 'logout', icon: 'pi pi-fw pi-sign-out', command: () => {
        this.logout(true);
      }
    }]
  }]
  adminItems: MenuItem[] = [{
    label: 'Home',
    icon: 'pi pi-fw pi-home',
    routerLink: "/home"
  }, {label: 'Cart', icon: 'pi pi-fw pi-shopping-cart', routerLink: "/cart"}, {
    label: 'My profile',
    icon: 'pi pi-fw pi-user',
    items: [{label: 'My Transactions', icon: 'pi pi-fw pi-credit-card', routerLink: "profile/transactions"},
      {label: 'Admin Panel', routerLink: "admin/panel"},
      {
        label: 'logout', icon: 'pi pi-fw pi-sign-out', command: () => {
          this.logout(true);
        }
      }]
  }]

  constructor(private storageService: StorageService, private authService: AuthService, private router: Router,
              private categoryService: CategoryService, private toastService: ToastService, private authGuard: AuthGuard) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.getMenubarCategories().then(categories => {
        console.log("1")
        this.items = []
        let tempItems: MenuItem[] = []
        if (this.storageService.isLoggedIn()) {
          if (this.authService.user && this.authService.user.role === "USER") {
            tempItems = [...this.userItems]
            tempItems.splice(1, 0, ...categories)
          } else {
            tempItems = [...this.adminItems]
            tempItems.splice(1, 0, ...categories)
          }
        } else {
          tempItems = [...this.anonymousItems]
          tempItems.splice(1, 0, ...categories)
        }
        this.items = tempItems
      }).catch(reason => this.items = this.anonymousItems)
      this.authService.onLoginStatusChange.subscribe(value => this.refreshMenubarLoginState(value.action,value.shouldToast));
      this.authGuard.onLoginStatusChange.subscribe(value => this.refreshMenubarLoginState(value.action,value.shouldToast));
    }, 1000)
  }

  private refreshMenubarLoginState(isLoggedIn: boolean, shouldToast:boolean) {
    return isLoggedIn ? this.login() : this.logout(shouldToast);
  }

  async getMenubarCategories(): Promise<MenuItem[]> {
    try {
      const res = await this.categoryService.getTopLevelCategories();
      return res.map((cat) => ({
        label: `${cat.name}`,
        routerLink: `/search/${cat.name}`,
      }));
    } catch (error) {
      throw error;
    }
  }

  private login() {

    this.getMenubarCategories().then(categories => {
      console.log("2")
      let tempItems: MenuItem[] = []

      if (this.authService.user && this.authService.user.role === "USER") {
        tempItems = [...this.userItems]
        tempItems.splice(1, 0, ...categories)
      } else {
        tempItems = [...this.adminItems]
        tempItems.splice(1, 0, ...categories)
      }
      this.items = []
      this.items = tempItems
      console.log("ITEMS AFTER LOGIN:", this.items)
    }).catch(reason => this.items = this.anonymousItems)
  }

  logout(shouldToast:boolean): any {
    console.log("3")
    if (this.storageService.isLoggedIn()) {
      this.authService.logout().subscribe({
        next: value => {
          this.items = []
          this.getMenubarCategories().then(categories => {
            let tempItems: MenuItem[] = []
            tempItems = [...this.anonymousItems]
            tempItems.splice(1, 0, ...categories)
            this.items = tempItems
          }).catch(reason => this.items = [...this.anonymousItems])
          if(shouldToast) this.toastService.showSuccess("Log out", "You've been logged out.")
        },
        error: err => {
          this.storageService.cleanAccessToken()
          this.storageService.getRefreshToken()
          console.log(err);
        }
      });
    }
    this.router.navigate(['home'])
  }

  menuUpdateAfterTokenExpires():any{
    this.items = []
    this.getMenubarCategories().then(categories => {
      let tempItems: MenuItem[] = []
      tempItems = [...this.anonymousItems]
      tempItems.splice(1, 0, ...categories)
      this.items = tempItems
    }).catch(reason => this.items = this.anonymousItems)
  }


}
