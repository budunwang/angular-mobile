/**
 * 入口页面
 * @description :: 入口页面
 */
import { Component, OnInit } from '@angular/core'


@Component({
    selector: '<index></index>',
    templateUrl: 'index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

    currentTab: string = 'raw'
    photoInfoId: string

    private showDirective : boolean= false



    ngOnInit(): void {
      let location = window.location.href
      this.photoInfoId = location.substring(location.lastIndexOf('/'),location.length)
    }

    onTab(tab, flag){
        if(!flag){
            return
        }
        this.currentTab = tab
    }

    toggleDirective(){
      this.showDirective =  !this.showDirective
    }


}
