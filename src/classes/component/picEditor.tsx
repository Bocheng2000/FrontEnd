import * as React from 'react'
import Modal from 'antd/lib/modal'
import Slider from 'antd/lib/Slider'
import Editor from 'react-avatar-editor'
import * as instance from '../../utils/instance'
import { ELanguageEnv, ESystemTheme, EFontFamily } from '../../reducer/main'
import localWithKey from '../../language'
import { getFontFamily } from '../../utils/font'

export interface IPicEditorProps {
  ref?: (e: PicEditor) => void;
}

export interface IPicEditorShowProps {
  fontFamily?: EFontFamily
  mode?: ESystemTheme
  image: string
  width: number
  height: number
  showRadius?: boolean
  handler?: (err: string, result?: string) => void
}

export interface IPicEditorState extends IPicEditorShowProps {
  visible: boolean
  scale: number
  rotate: number
  radius: number
  handler?: (err: string, result?: string) => void
}

class PicEditor extends React.Component<IPicEditorProps, IPicEditorState>  {
  private editor: Editor
  constructor(props: IPicEditorProps) {
    super(props)
    this.state = {
      visible: false,
      image: undefined,
      showRadius: false,
      width: 0,
      height: 0,
      scale: 1,
      rotate: 0,
      radius: 0,
    }
  }

  crop(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    var min_size = Math.min(w, h)
    if (r > min_size / 2) r = min_size / 2
    context.beginPath()
    context.moveTo(x + r, y)
    context.arcTo(x + w, y, x + w, y + h, r)
    context.arcTo(x + w, y + h, x, y + h, r)
    context.arcTo(x, y + h, x, y, r)
    context.arcTo(x, y, x + w, y, r)
    context.closePath()
  }

  doneBtnDidClick() {
    try {
      const { radius } = this.state
      if (radius === 0) {
        const base64 = this.editor.getImageScaledToCanvas().toDataURL('image/jpeg')
        const { handler } = this.state
        handler && handler(undefined, base64)
      } else {
        const data = this.editor.getImageScaledToCanvas()
        const context = data.getContext('2d')
        var pattern = context.createPattern(data, "no-repeat")
        context.clearRect(0, 0, data.width, data.height)
        this.crop(context, 0, 0, data.width, data.height, this.state.radius)
        context.fillStyle = "#FFFFFF"
        context.fillRect(0, 0, data.width, data.height)
        context.fillStyle = pattern;
        context.fill()
        const base64 = data.toDataURL('image/jpeg')
        const { handler } = this.state
        handler && handler(undefined, base64)
      }
    } catch (e) {
      const { handler } = this.state
      handler && handler(e.message)
    } finally {
      this.hide()
    }
  }

  public show(params: IPicEditorShowProps) {
    this.setState({
      visible: true,
      scale: 1,
      rotate: 0,
      radius: 0,
      ...params,
    })
  }

  private hide() {
    this.setState({
      visible: false,
      image: undefined,
      width: 0,
      height: 0,
      handler: undefined,
      scale: 1,
      rotate: 0,
      radius: 0,
    })
  }

  private getConfig() {
    const { mode } = this.state
    let config
    if (mode === ESystemTheme.night) {
      config = {
        mask: 'base-model-night',
        color: '#C8C8C8',
        border: '1px solid #2F2F2F'
      }
    } else {
      config = {
        mask: 'base-model-day',
        color: '#333333',
        border: '1px solid #DDDDDD'
      }
    }
    return config
  }


  render() {
    const { visible, image, showRadius, width,
      height, scale, rotate, radius, fontFamily,
      mode,
    } = this.state
    if (!visible) {
      return null
    }
    const language = instance.getValueByKey('language') as ELanguageEnv
    const config = this.getConfig()
    return (
      <Modal
        className={config.mask}
        title={null} centered
        maskClosable={false}
        closable={false}
        visible
        footer={null}
        width={width + 20}
      >
        <div style={{ fontFamily: getFontFamily(fontFamily) }}>
          <div className="pic-edit-header">
            <span className="pic-edit-title" style={{ color: config.color }}>
              {localWithKey(language, 'picture-crop')}
            </span>
            <i
              className="iconfont icon-guanbi pic-edit-close"
              onClick={() => this.hide()}
            />
          </div>
          <Editor
            crossOrigin="anonymous"
            ref={(e) => { this.editor = e }}
            image={image}
            width={width}
            style={{ border: config.border }}
            height={height}
            border={0}
            borderRadius={radius}
            color={[0, 0, 0, 0.6]}
            scale={scale}
            rotate={rotate}
          />
          <div className="pic-edit-tool">
            {
              width === height && showRadius ?
                (
                  <div className="cell">
                    <span className="tag" style={{ color: config.color }}>
                      {localWithKey(language, 'picture-radius')}
                    </span>
                    <Slider
                      min={0}
                      max={Math.max(width, height) / 2}
                      step={1}
                      value={radius}
                      tipFormatter={e => `${localWithKey(language, 'picture-radius')} ${e}`}
                      onChange={e => this.setState({ radius: Number(e) })}
                    />
                  </div>
                ) : null
            }
            {
              width === height ?
                (
                  <div className="cell">
                    <span className="tag" style={{ color: config.color }}>
                      {localWithKey(language, 'picture-rotate')}
                    </span>
                    <Slider
                      min={0}
                      max={360}
                      step={1}
                      value={rotate}
                      tipFormatter={e => `${localWithKey(language, 'picture-rotate')} ${e} deg`}
                      onChange={e => this.setState({ rotate: Number(e) })}
                    />
                  </div>
                ) : null
            }
            <div className="cell">
              <span className="tag" style={{ color: config.color }}>
                {localWithKey(language, 'picture-scale')}
              </span>
              <Slider
                min={0.5}
                max={2}
                step={0.1}
                tipFormatter={e => `${localWithKey(language, 'picture-scale')} ${e}`}
                value={scale}
                onChange={e => this.setState({ scale: Number(e) })}
              />
              <span
                className="done"
                onClick={() => this.doneBtnDidClick()}
              >
                {localWithKey(language, 'done')}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
export default PicEditor
