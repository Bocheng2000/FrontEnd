import * as React from 'react'
import * as $ from 'jquery'
import { connect } from 'react-redux'
import Radio from 'antd/lib/radio'
import Editor from './component/editor'
import { EFontFamily, EFontColor, ELanguageEnv, ESystemTheme } from '../../reducer/main'
import { IStoreState } from '../../reducer'
import { ILoginResponse, ESettingEditor, findSetting } from '../../http/user'
import * as instance from '../../utils/instance'
import { getFontFamily, getThemeColor } from '../../utils/font'
import localWithKey from '../../language'
import PicEditor from '../component/picEditor'
import { cover_w, cover_h } from '../../utils/config'
import { showTips } from '../../utils/tips'
import { upload } from '../../http/upload'
import { getHashUrl } from '../../utils/http'


const { Group } = Radio

interface IWriteProps {
  fontFamily: EFontFamily
  fontColor: EFontColor
  language: ELanguageEnv
  mode: ESystemTheme
  info: ILoginResponse
}

interface IWriteState {
  editor: ESettingEditor
  cover: string
}

class Write extends React.Component<IWriteProps, IWriteState> {
  private editor: PicEditor

  constructor(props: IWriteProps) {
    super(props)
    this.state = {
      editor: ESettingEditor.RICHTEXT,
      cover: ''
    }
  }

  componentWillMount() {
    const { info } = this.props
    if (!info) {
      instance.getValueByKey('history').replace('/')
    }
  }

  componentDidMount() {
    const { info } = this.props
    findSetting({
      id: info.id,
      token: info.token,
    }, (err, data) => {
      if (!err && data) {
        if (data.editor !== this.state.editor) {
          this.setState({ editor: data.editor })
        }
      }
    })
  }

  getConfig() {
    let res
    const { mode } = this.props
    if (mode === ESystemTheme.day) {
      res = {
        border: '1px solid #F0F0F0',
        color: '#333333',
        backgroundColor: getThemeColor(mode)
      }
    } else {
      res = {
        border: '1px solid #2F2F2F',
        color: '#c8c8c8',
        backgroundColor: getThemeColor(mode)
      }
    }
    return res
  }

  toPickerFile(e: React.ChangeEvent) {
    const file = (e.target as HTMLInputElement).files[0]
    if (!file) return
    var reader = new FileReader()
    reader.onloadend = (e: any) => {
      const targegt = document.getElementById('picker') as HTMLInputElement
      targegt.value = ''
      this.editor.show({
        image: (e.target as any).result,
        width: cover_w,
        height: cover_h,
        handler: (err, result) => {
          if (err)
            showTips(err)
          else
            this.uploadImage(result)
        }
      })
    }
    reader.readAsDataURL(file)
  }

  uploadImage(base64: string) {
    const buffer = new Buffer(base64.split(',')[1], 'base64')
    upload('jpg', buffer, (err, hash) => {
      if (err || !hash) {
        const { language } = this.props
        showTips(err || localWithKey(language, 'upload-failed'))
      } else {
        this.setState({ cover: hash })
      }
    })
  }

  publish() {

  }

  renderBar(config: any) {
    const { language, fontFamily } = this.props
    const family = getFontFamily(fontFamily)
    return (
      <div className="bar" style={{ backgroundColor: config.backgroundColor }}>
        <div className="bar-container">
          <span className="bar-tip" style={{ color: config.color }}>
            {localWithKey(language, 'write-post')}
          </span>
          <div className="editor-switch">
            <span className="bar-editor" style={{ color: config.color }}>
              {localWithKey(language, 'editor-switch')}
            </span>
            <Group
              onChange={(e) => this.setState({ editor: e.target.value as ESettingEditor })}
              value={this.state.editor}
            >
              <Radio value={0}>
                <span
                  className="value"
                  style={{ color: config.color, fontFamily: family }}
                >{localWithKey(language, 'rich-text')}</span>
              </Radio>
              <Radio value={1}>
                <span
                  className="value"
                  style={{ color: config.color, fontFamily: family }}
                >{localWithKey(language, 'mac-down')}</span>
              </Radio>
            </Group>
          </div>
          <span className="publish" onClick={() => this.publish()}>
            <i className="iconfont icon-yun yun" />
            {localWithKey(language, 'publish')}
          </span>
        </div>
      </div>
    )
  }

  renderCover() {
    const { cover } = this.state
    if (cover) {
      return (
        <div className="cover-o" >
          <img className="image" src={getHashUrl(cover)} />
          <div className="tool">
            <i className="iconfont icon-xiangji camera" />
            <i className="iconfont icon-shanchu camera" />
          </div>
        </div>
      )
    }
    const { mode } = this.props
    return (
      <div
        className="cover"
        style={{
          background: mode === ESystemTheme.night ? '#4B4B4B' : '#F7F8F9',
        }}
        onClick={() => $('#picker').click()}
      >
        <i className="iconfont icon-xiangji camera" />
        <span className="cover-tip">添加题图</span>
        <input
          id="picker"
          type="file"
          className="pick-file"
          accept="image/*"
          onChange={(e) => this.toPickerFile(e)}
        />
      </div>
    )
  }

  render() {
    const { fontFamily, mode, language } = this.props
    const config = this.getConfig()
    return (
      <div id="write" style={{ fontFamily: getFontFamily(fontFamily) }}>
        {this.renderBar(config)}
        <div className="container">
          {this.renderCover()}

          <Editor mode={mode} language={language} />
        </div>
        <PicEditor
          ref={(e) => { this.editor = e }}
          mode={mode}
          fontFamily={fontFamily}
          language={language}
        />
      </div>
    )
  }
}

function mapStateToProps({
  main: { system: { fontFamily, fontColor, language, mode } },
  user: { info }
}: IStoreState) {
  return {
    fontFamily,
    fontColor,
    language,
    mode,
    info,
  }
}

export default connect(mapStateToProps)(Write)
