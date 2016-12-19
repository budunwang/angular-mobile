/**
 * 入口页面
 * @description :: 入口页面
 */
import {Component, OnInit} from "@angular/core";
import {CacheService} from "../../services/cache.service";
import {UserInfoService} from "../../modules/user-info/user-info.service";
import {Router} from "@angular/router";
import {QINIU_DOMAIN} from "../../constant/config";
import {isNull} from "util";
import {BrandService} from "../../services/brand.service";
import {Brand} from "../../shared/brand/brand.model";


@Component({
  selector: '<index></index>',
  templateUrl: 'index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [UserInfoService]
})
export class IndexComponent implements OnInit {

  currentTab: string = 'raw'
  isTransform = false
  user: any = {}
  brand: Brand = new Brand(0, "", "")
  qinuDomain = QINIU_DOMAIN + "/"

  constructor(private userInfoService: UserInfoService,
              private brandService: BrandService,
              private cacheService: CacheService,
              private router: Router) {
  }

  ngOnInit(): void {
    let location = window.location.href
    this.initCustomer()
    this.initBrand()
    this.brandService.brandChange.subscribe((brand) => {
      this.brand = brand;
    })
  }

  onTab(tab, flag) {
    if (!flag) {
      return
    }
    this.currentTab = tab
  }

  onToggle(flag) {
    this.isTransform = flag
    if (this.isTransform && window.location.href.endsWith("/user-info")) {//在个人资料页面到此，个人资料可能已经改变，需从initCustomer
      this.initCustomer()
    }
  }

  initCustomer() {
    if (isNull(this.cacheService.getCustomer())) {
      this.userInfoService.getUserInfo().then((resp: any) => {
        this.cacheService.setCustomer(resp)
        this.user = resp
      }, (erroResp: any) => {
        console.log(erroResp)
        this.router.navigate(['/error']);
      })
    } else {
      this.user = this.cacheService.getCustomer()
    }
  }

  initBrand() {
    this.brandService.getBrand().then((brand: Brand) => {
      this.brand = brand
    }, (erroResp: any) => {
      console.log(erroResp)
      this.router.navigate(['/error']);
    })
  }
}
