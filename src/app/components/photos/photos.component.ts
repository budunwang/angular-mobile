import {Component, OnInit, ViewChild} from "@angular/core";
import {Scene} from "../scene/scene";
import {PhotoService} from "../../services/photos.service";
import {SceneFormComponent} from "../scene/scene-form.component";
import {QINIU_DOMAIN} from "../../constant/config";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Page} from "../../common/pagination/page";


@Component({
  selector: 'photos',
  templateUrl: 'photos.component.html',
  styleUrls: ['./photos.component.css'],
  providers: [PhotoService]
})

export class PhotosComponent implements OnInit {
  @ViewChild(SceneFormComponent)
  sceneFormComponent: SceneFormComponent
  //排序项
  sort = {
    item: '',
    order: 'asc',
    key: ''
  }
  //当前状态 初选/精选
  currentStatus:string = ''

  //是否正在加载数据
  isLoadingData = false

  //图片列表
  photoList: any [] = []

  //当前场景
  currentScene: Scene

  //是否查看大图
  isPreview: boolean = false

  //是否正在查看PC大图
  isPcPreview: boolean = false

  isShowConfirm: boolean = false

  photoIndex = -1

  //当前大图Index
  previewIndex: number

  //订单号
  photoInfoId: number

  //分页信息
  page: Page = new Page()

  //当前场景ID
  currentSceneId = null

  //是否显示提示
  isShowGuide = true

  isShowTip = false

  //是否显示PC端提示信息
  isShowPcGuide = true

  //是否显示成功提示
  isShowSuccess = false

  photoCols = {
    col1: {
      height: 0,
      list: []
    },
    col2: {
      height: 0,
      list: []
    }
  }

  /**
   * 构造函数
   * @param photoService
   */
  constructor(private photoService: PhotoService,
              private route: ActivatedRoute, private router: Router) {
  }

  /**
   * 初始化事件
   */
  ngOnInit(): void {
    if(document.getElementById('html').offsetWidth > 769){
      this.isShowGuide = false
    }

    this.route.params.forEach((params: Params) => {
      this.photoInfoId = +params['photoinfoid']
      this.currentStatus = +params['status']? params['status'] : ''
    });

    if(this.currentStatus === '1'){
      this.isShowGuide = false
    }

    this.getPhotos()
  }


  /**
   * 获取图片列表
   */
  getPhotos(): void {
    //设置正在加载数据状态
    this.isLoadingData = true

    //请求加载图片列表
    this.photoService.getPhotos(this.photoInfoId, this.currentSceneId, this.currentStatus, this.page, this.sort.key, this.sort.order).then((photos: any) => {

      this.page = photos;
      //设置返回数据
      let results = photos.results ? photos.results : []

      let list = []

      if (results && results.length) {
        results.map((item, index)=> {
          results[index].imgKey = QINIU_DOMAIN + '/' + item.imgKey + '-300'
          list.push(results[index])
        }, this)
        this.photoList = this.photoList.concat(list)
        this.loadImages(0)
      }else{
        this.isLoadingData = false
      }
    })
  }

  loadImages(index){
    let image = new Image()
    let _self = this
    image.onload=function(){
      let height = image.height
      let width = image.width
      let photo = _self.photoList[index]
      photo.listIndex = index
      if(_self.photoCols.col1.height <= _self.photoCols.col2.height){
        _self.photoCols.col1.list.push(photo)
        _self.photoCols.col1.height += height / width
      }else{
        _self.photoCols.col2.list.push(photo)
        _self.photoCols.col2.height += height / width
      }
      if(index< _self.photoList.length - 1){
        _self.loadImages(index+1)
      }else{
        _self.isLoadingData = false
      }
    }
    image.src = this.photoList[index].imgKey
  }



  /**
   * 切换原片场景
   * @param mold
   */
  onTabSceneCb(scene) {
    //选择当前场景
    if (this.currentScene && scene.id === this.currentScene.id) {
      return
    }
    this.page = new  Page()
    //设置当前原片场景
    this.currentScene = scene

    this.currentSceneId = scene.id
    //置空原片列表
    this.photoList = []

    this.photoCols = {
      col1: {
        height: 0,
        list: []
      },
      col2: {
        height: 0,
        list: []
      }
    }

    //获取当前场景原片列表
    this.getPhotos()
  }

  /**
   * 查看当前大图
   * @param index
   */
  onPreview(index, photo) {
    this.isPreview = true
    this.previewIndex = index
  }

  /**
   * 关闭当前大图
   */
  onClosePreview() {
    this.isPreview = false
  }


  /**
   * Pc端预览大图
   * @param index
   * @param photo
     */
  onPcPreview(index){
    this.isPcPreview = true
    this.previewIndex = index
  }

  /**
   * 关闭Pc端预览图片
   */
  onClosePcPreview(){
    this.isPcPreview = false
  }

  /**
   * 关闭提示框
   */
  onCloseTip(){
    this.isShowGuide = false
    this.isShowTip = false
  }

  onClosePcTip(){
    this.isShowPcGuide = false
  }

  /**
   * 关闭成功提示
   * @param photo
   */

  onCloseSuccess(){
    this.isShowSuccess = false
  }

  //原片选中
  onChoose(index){
    this.photoIndex = index
    if(this.currentStatus ==='1'){
      this.isShowConfirm = true
    } else {
      this.deleteConfirm()
    }
  }

  /**
   * 进入精选
   */
  onNext(){
    if(this.sceneFormComponent.checkedNum<this.sceneFormComponent.requireNum){
      return
    }
    this.router.navigate(['/raw/'+this.photoInfoId+"/", 1])
  }

  /**
   * 确认提交
   */
  onFinish(){
    if(this.sceneFormComponent.checkedNum < this.sceneFormComponent.requireNum){
      return
    }
    //选片完成
    this.photoService.finish(this.photoInfoId).then((result)=>{
      this.router.navigate(['/truing', this.photoInfoId])
    })
  }

  onBack(){
    this.router.navigate(['/raw', this.photoInfoId])
  }

  deleteConfirm(){

    let index = this.photoIndex

    let photo = this.photoList[index]

    let status = photo.status == 1 ? 0 : 1

    this.photoService.check(this.photoInfoId, photo.id, status).then((result)=>{
      //重新获取场景信息
      this.sceneFormComponent.getScenes()
      photo.status = status
      //显示成功提示
      this.isShowSuccess = true


      //进入精选删除逻辑
      if(this.currentStatus == '1'){
        //删除最后一张图片,强制关闭大图查看器
        if(index === this.photoList.length - 1){
          this.isPcPreview = false
          this.isPreview = false
        }

        //从照片列表内一处内容
        this.photoList.splice(index, 1)

        //清除瀑布布局的内容
        this.photoCols = {
          col1: {
            height: 0,
            list: []
          },
          col2: {
            height: 0,
            list: []
          }
        }

        //重新计算瀑布布局
        this.loadImages(0)

        //判断是否显示  提示剩余数量刚好等于 要求数量
        if(this.sceneFormComponent.checkedNum -1 === this.sceneFormComponent.requireNum ){
          this.isShowTip = true
        }

      }

      //关闭删除确认框
      this.isShowConfirm = false
    })
  }

  deleteCancel(){
    this.isShowConfirm = false
  }

}
