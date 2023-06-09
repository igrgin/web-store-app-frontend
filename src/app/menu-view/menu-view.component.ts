import {Component, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {AuthService} from "../service/auth/auth.service";
import {StorageService} from "../service/storage/storage.service";
import {CategoryService} from "../service/category/category.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AuthGuard} from "../guard/auth.guard";
import {ToastService} from "../service/toast/toast.service";


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
  }, {
    label: 'Cart',
    icon: 'pi pi-fw pi-shopping-cart',
    routerLink: "/cart",
    badgeStyleClass:"p-badge-danger"
  }, {
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
  }, {
    label: 'Cart',
    icon: 'pi pi-fw pi-shopping-cart',
    routerLink: "/cart",
    badgeStyleClass:"p-badge-danger"
  }, {
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
  }, {
    label: 'Cart',
    icon: 'pi pi-fw pi-shopping-cart',
    routerLink: "/cart"
  }, {
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

  constructor(private storageService: StorageService, private authService: AuthService, private router: Router, private route:ActivatedRoute,
              private categoryService: CategoryService, private toastService: ToastService, private authGuard: AuthGuard) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.initiateMenu();
      this.authService.onLoginStatusChange.subscribe(value => this.refreshMenubarLoginState(value.action,value.shouldToast));
      this.authGuard.onLoginStatusChange.subscribe(value => this.refreshMenubarLoginState(value.action,value.shouldToast));
      this.storageService.changeCart.subscribe(() => this.updateCart())
      this.router.events.subscribe(event => {
        if(event instanceof NavigationEnd) this.initiateMenu()
      });
    }, 1000)
  }

  private initiateMenu() {
    this.getMenubarCategories().then(categories => {
      console.log("1")
      this.items = []
      let tempItems: MenuItem[];
      if (this.storageService.isLoggedIn()) {
        if (this.authService.user && this.authService.user.role === "USER") {
          tempItems = [...this.userItems]
          if (this.storageService.getCart().length != 0)
            tempItems.filter(value => value.label == "Cart")[0].badge = this.storageService.getCart().length.toString()
          tempItems.splice(1, 0, ...categories)
        } else {
          tempItems = [...this.adminItems]
          if (this.storageService.getCart().length != 0)
            tempItems.filter(value => value.label == "Cart")[0].badge = this.storageService.getCart().length.toString()
          tempItems.splice(1, 0, ...categories)
        }
      } else {
        tempItems = [...this.anonymousItems]
        if (this.storageService.getCart().length != 0)
          tempItems.filter(value => value.label == "Cart")[0].badge = this.storageService.getCart().length.toString()
        tempItems.splice(1, 0, ...categories)
      }
      this.items = tempItems
    }).catch(() => this.items = this.anonymousItems)
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
      let tempItems: MenuItem[];

      if (this.authService.user && this.authService.user.role === "USER") {
        tempItems = [...this.userItems]
        if(this.storageService.getCart().length == 0) tempItems.filter(value => value.label=="Cart")[0].badge=undefined
        else tempItems.filter(value => value.label=="Cart")[0].badge=this.storageService.getCart().length.toString()
        tempItems.splice(1, 0, ...categories)
      } else {
        tempItems = [...this.adminItems]
        if(this.storageService.getCart().length == 0) tempItems.filter(value => value.label=="Cart")[0].badge=undefined
        else tempItems.filter(value => value.label=="Cart")[0].badge=this.storageService.getCart().length.toString()
        tempItems.splice(1, 0, ...categories)
      }
      this.items = []
      this.items = tempItems
    }).catch(() => this.items = this.anonymousItems)
  }

  logout(shouldToast:boolean): any {
    console.log("3 ",this.storageService.isLoggedIn())
    if (this.storageService.isLoggedIn()) {
      this.authService.logout().subscribe({
        next: () => {
          this.items = []
          this.getMenubarCategories().then(categories => {
            let tempItems: MenuItem[];
            tempItems = [...this.anonymousItems]
            if(this.storageService.getCart().length == 0) tempItems.filter(value => value.label=="Cart")[0].badge=undefined
            else tempItems.filter(value => value.label=="Cart")[0].badge=this.storageService.getCart().length.toString()
            tempItems.splice(1, 0, ...categories)
            this.items = tempItems
          }).catch(() => this.items = [...this.anonymousItems])
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
      let tempItems: MenuItem[];
      tempItems = [...this.anonymousItems]
      if(this.storageService.getCart().length == 0) tempItems.filter(value => value.label=="Cart")[0].badge=undefined
      else tempItems.filter(value => value.label=="Cart")[0].badge=this.storageService.getCart().length.toString()
      tempItems.splice(1, 0, ...categories)
      this.items = tempItems
    }).catch(() => {
      let tempItems: MenuItem[];
      tempItems = [...this.anonymousItems]
      if(this.storageService.getCart().length == 0) tempItems.filter(value => value.label=="Cart")[0].badge=undefined
      else tempItems.filter(value => value.label=="Cart")[0].badge=this.storageService.getCart().length.toString()
      this.items = tempItems
    })
  }


  private updateCart() {
    let tempItems:MenuItem[]= [...this.items]
    if(this.storageService.getCart().length == 0) tempItems.filter(value => value.label=="Cart")[0].badge=undefined
    else tempItems.filter(value => value.label=="Cart")[0].badge=this.storageService.getCart().length.toString()
    this.items=tempItems
  }
}
