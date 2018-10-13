import * as React from 'react'
import E from 'wangeditor'
import * as $ from 'jquery'
import { upload } from '../../../http/upload'
import { getHashUrl } from '../../../utils/http'
import { showTips } from '../../../utils/tips'
import { ESystemTheme, ELanguageEnv } from '../../../reducer/main'
import { cover_w } from '../../../utils/config'
import localWithKey from '../../../language'

export interface IEditorProps {
  ref?: (e: Editor) => void
  mode?: ESystemTheme
  language?: ELanguageEnv
  contentChange?: (html: string) => void
}

export default class Editor extends React.Component<IEditorProps> {
  private editor: typeof E

  componentDidMount() {
    this.configEditor()
    this.configUI()
  }

  configUI() {
    $('#cloud-editor>div').css({
      'background-color': 'transparent',
      'border': 'none',
    })
    const config = this.getConfig()
    $('#cloud-editor .w-e-toolbar').css({
      'padding': 0,
      'border-top': `1px solid #C8C8C8`,
      'border-bottom': `1px solid #C8C8C8`,
    })
    $('#cloud-editor .w-e-text').css('color', config.color)
  }

  getConfig() {
    let res
    const { mode } = this.props
    if (mode === ESystemTheme.day) {
      res = {
        color: '#333333',
      }
    } else {
      res = {
        color: '#c8c8c8',
      }
    }
    return res
  }

  public getContent(): string {
    return this.editor.txt.html()
  }

  configEditor() {
    const { language, contentChange } = this.props
    const elem = document.getElementById('cloud-editor')
    this.editor = new E(elem)
    this.editor.customConfig.debug = false
    this.editor.customConfig.showLinkImg = false
    this.editor.customConfig.uploadImgMaxLength = 1
    this.editor.customConfig.zIndex = 8
    this.editor.customConfig.customUploadImg = (files: Array<File>) => {
      const file = files[0]
      if (!file) {
        return
      }
      var reader = new FileReader()
      reader.onloadend = (e: any) => {
        const base64 = (e.target as any).result
        this.uploadImage(base64)
      }
      reader.readAsDataURL(file)
    }
    this.editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'image',  // 插入图片
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'
    ]
    this.editor.customConfig.lang = {
      '设置标题': localWithKey(language, 'editor-title'),
      '正文': localWithKey(language, 'editor-p'),
      '字号': localWithKey(language, 'editor-size'),
      '字体': localWithKey(language, 'editor-font-family'),
      '文字颜色': localWithKey(language, 'editor-color'),
      '背景色': localWithKey(language, 'editor-bjcolor'),
      '链接文字': localWithKey(language, 'editor-link-text'),
      '插入代码': localWithKey(language, 'editor-insert-code'),
      '插入': localWithKey(language, 'editor-insert'),
      '链接': localWithKey(language, 'editor-link'),
      '上传图片': localWithKey(language, 'editor-upload-img'),
      '上传': localWithKey(language, 'editor-upload'),
      '创建': localWithKey(language, 'editor-init'),
      '设置列表': localWithKey(language, 'editor-list'),
      '有序列表': localWithKey(language, 'editor-order'),
      '无序列表': localWithKey(language, 'editor-disorder'),
      '对齐方式': localWithKey(language, 'editor-align'),
      '靠左': localWithKey(language, 'editor-left'),
      '居中': localWithKey(language, 'editor-center'),
      '靠右': localWithKey(language, 'editor-right')
    }
    if (contentChange) {
      this.editor.customConfig.onchange = contentChange
    }
    this.editor.create()
    this.editor.txt.clear()
  }

  uploadImage(base64: string) {
    let image = new Image()
    image.src = base64
    image.onload = (i: any) => {
      const o = (i.path as Array<any>)[0]
      let { width, height } = o
      const w = cover_w - 10
      if (width > w) {
        height = Math.floor(w / width * height)
        width = w
      }
      image = undefined
      const buffer = new Buffer(base64.split(',')[1], 'base64')
      upload('jpg', buffer, (err, r) => {
        if (!err && r) {
          const img = `<img src=${getHashUrl(r)} width=${width} height=${height} />`
          this.editor.cmd.do('insertHTML', img);
        } else {
          showTips(err)
        }
      })
    }
  }

  render() {
    return (
      <div id="cloud-editor" />
    )
  }
}
