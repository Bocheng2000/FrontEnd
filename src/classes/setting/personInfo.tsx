import * as React from 'react'
import Radio from 'antd/lib/radio'
import DatePicker from 'antd/lib/date-picker'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import * as moment from 'moment'
import { ILoginResponse, EUserOnce } from '../../http/user'
import Loading from './component/loading'
import { IStoreState } from '../../reducer'
import { ESystemTheme, ELanguageEnv, EFontColor, EFontFamily } from '../../reducer/main'
import PicEditor from '../component/picEditor'
import localWithKey from '../../language'
import { getFontColor, getFontFamily } from '../../utils/font'
import * as instance from '../../utils/instance'
import { cover_h, cover_w, avatar_h, avatar_w, animate_delay } from '../../utils/config'
import { showTips, EShowTipsType } from '../../utils/tips'
import { upload } from '../../http/upload'
import * as UserActions from '../../action/user'
import { getHashUrl } from '../../utils/http'
import { modifySensitive, modifyBaseInfo, modifyIdString } from '../../http/user'
import { nameReg } from '../../utils/regex'
import Confirm, { EConfirmTypes } from '../component/confirm'

const { Group } = Radio

interface IPersonInfoProps {
  mode: ESystemTheme
  language: ELanguageEnv
  fontColor: EFontColor
  fontFamily: EFontFamily
  info: ILoginResponse
  dispatch?: Dispatch
}

interface IPersonInfoState {
  init: boolean
  info: ILoginResponse
}

class PersonInfo extends React.Component<IPersonInfoProps, IPersonInfoState> {
  private editor: PicEditor
  private confirm: Confirm
  private timer: any
  private userAction: typeof UserActions

  constructor(props: IPersonInfoProps) {
    super(props)
    this.userAction = bindActionCreators(UserActions, props.dispatch)
    this.state = {
      init: false,
      info: props.info
    }
  }

  componentWillMount() {
    const { info } = this.props
    if (!info) {
      instance.getValueByKey('history').replace('/')
    }
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ init: true })
    }, animate_delay)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  getConfig() {
    const { mode } = this.props
    const isDay = mode === ESystemTheme.day
    const res = {
      changeClass: 'change-day',
      nameInput: 'name-input-day',
      borderBottom: 'base-day',
      unbind: 'unbind-day',
      avatar: 'avatar-day'
    }
    if (!isDay) {
      res.changeClass = 'change-night'
      res.nameInput = 'name-input-night'
      res.borderBottom = 'base-night'
      res.unbind = 'unbind-night'
      res.avatar = 'avatar-night'
    }
    return res
  }

  getLocale(language: ELanguageEnv) {
    switch (language) {
      case ELanguageEnv.en:
        return require('antd/lib/date-picker/locale/en_US.js')
      case ELanguageEnv.zhHant:
        return require('antd/lib/date-picker/locale/zh_TW.js')
      default:
        return require('antd/lib/date-picker/locale/zh_CN.js')
    }
  }

  toPickerFile(e: React.ChangeEvent) {
    const file = (e.target as HTMLInputElement).files[0]
    if (!file) return
    var reader = new FileReader()
    reader.onloadend = (e: any) => {
      const targegt = document.getElementById('picker') as HTMLInputElement
      targegt.value = ''
      const { from } = targegt.dataset
      let wh = {
        width: cover_w,
        height: cover_h
      }
      if (from !== 'cover') {
        wh = {
          width: avatar_w,
          height: avatar_h,
        }
      }
      this.editor.show({
        image: (e.target as any).result,
        ...wh,
        handler: (err, result) => {
          if (err)
            showTips(err)
          else
            this.uploadImage(result, from)
        }
      })
    }
    reader.readAsDataURL(file)
  }

  uploadImage(base64: string, from: string) {
    const buffer = new Buffer(base64.split(',')[1], 'base64')
    upload('jpg', buffer, (err, hash) => {
      if (err || !hash) {
        const { language } = this.props
        showTips(err || localWithKey(language, 'upload-failed'))
      } else {
        this.saveInfoToServer({ [from]: hash }, (ex) => {
          if (ex) {
            showTips(ex)
          } else {
            const { language } = this.props
            showTips(localWithKey(language, 'save-success'), EShowTipsType.success)
            const { info } = this.props
            this.updateInfo({
              ...info,
              [from]: hash,
            })
          }
        })
      }
    })
  }

  saveInfo(params: any) {
    this.saveInfoToServer(params, (err) => {
      if (err) {
        showTips(err)
      } else {
        const { language } = this.props
        showTips(localWithKey(language, 'save-success'), EShowTipsType.success)
        const { info } = this.props
        this.updateInfo({
          ...info,
          ...params,
        })
      }
    })
  }

  toModifyIdString(idString: string, info: ILoginResponse) {
    if (info.once == EUserOnce.CHANGED) {
      if (info.wallet < 100) {
        const { language } = this.props
        showTips(localWithKey(language, 'leak-credit'))
        return
      }
    }
    modifyIdString({
      id: info.id,
      token: info.token,
      next: idString,
      update: true,
    }, (err) => {
      if (err) {
        showTips(err)
      } else {
        const { language } = this.props
        showTips(localWithKey(language, 'save-success'), EShowTipsType.success)
        const { info } = this.props
        this.updateInfo({
          ...info,
          idString,
          once: EUserOnce.CHANGED,
          wallet: info.once === EUserOnce.INIT ? info.wallet - 100 : info.wallet,
        })
      }
    })
  }

  updateIdString(idString: string) {
    const { language, fontFamily, mode } = this.props
    if (!nameReg.test(idString)) {
      showTips(localWithKey(language, 'support-number-char'))
      return
    }
    const info = instance.getValueByKey('info') as ILoginResponse
    let content
    if (info.once === EUserOnce.INIT) {
      content = localWithKey(language, 'idString-init-content')
    } else {
      content = localWithKey(language, 'idString-changed-content')
    }
    this.confirm.show({
      type: EConfirmTypes.CONFIRM,
      title: localWithKey(language, 'modify-idString-title'),
      content,
      cancel: {
        title: localWithKey(language, 'cancel')
      },
      ok: {
        title: localWithKey(language, 'continue'),
        handler: () => this.toModifyIdString(idString, info),
      }
    })
  }

  saveBase(params: any) {
    this.saveBaseInfo(params, (err) => {
      if (err) {
        showTips(err)
      } else {
        const { language } = this.props
        showTips(localWithKey(language, 'save-success'), EShowTipsType.success)
        const { info } = this.props
        this.updateInfo({
          ...info,
          ...params,
        })
      }
    })
  }

  saveBaseInfo(params: any, callback: (err: string) => void) {
    const info = instance.getValueByKey('info') as ILoginResponse
    modifyBaseInfo({
      id: info.id,
      token: info.token,
      ...params,
    }, callback)
  }

  saveInfoToServer(params: any, callback: (err: string) => void) {
    const info = instance.getValueByKey('info') as ILoginResponse
    modifySensitive({
      id: info.id,
      token: info.token,
      ...params,
    }, callback)
  }

  updateInfo(data: ILoginResponse) {
    this.setState({ info: data })
    instance.setValueByKey('info', data)
    localStorage.setItem('user', JSON.stringify(data))
    this.userAction.updateKeyValue('info', data)
  }

  renderAvatar(language: ELanguageEnv, config: any, info: ILoginResponse) {
    return (
      <div className="cell">
        <div className="avatar-cell">
          <img className={`avatar ${config.avatar}`} src={getHashUrl(info.avatar)} />
          <span
            className={`change ${config.changeClass}`}
            onClick={() => {
              const picker = document.getElementById('picker')
              picker.dataset.from = "avatar"
              picker.click()
            }}
          >
            {localWithKey(language, 'change-avatar')}
          </span>
        </div>
        <div className={`base ${config.borderBottom}`}>
          <span className="name-tag">
            {localWithKey(language, 'name')}
          </span>
          <input
            value={info.name}
            onChange={e => this.setState({ info: { ...info, name: e.target.value } })}
            maxLength={10}
            placeholder={localWithKey(language, 'input-name')}
            className={`name-input ${config.nameInput}`}
          />
          {
            (info.name.trim() !== '' && info.name !== this.props.info.name) ?
              (
                <span
                  className={`change ${config.changeClass}`}
                  onClick={() => this.saveInfo({ name: info.name.trim() })}
                  style={{ marginLeft: '10px' }}
                >
                  {localWithKey(language, 'save')}
                </span>
              ) : null
          }
        </div>
      </div>
    )
  }

  renderIDString(language: ELanguageEnv, config: any, info: ILoginResponse) {
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'idString')}
        </span>
        <input
          value={info.idString}
          maxLength={10}
          onChange={e => this.setState({ info: { ...info, idString: e.target.value } })}
          placeholder={localWithKey(language, 'input-idString')}
          className={`name-input ${config.nameInput}`}
        />
        {
          (info.idString.trim() !== '' && info.idString !== this.props.info.idString) ?
            (
              <span
                className={`change ${config.changeClass}`}
                onClick={() => this.updateIdString(info.idString.trim())}
                style={{ marginLeft: '10px' }}
              >
                {localWithKey(language, 'save')}
              </span>
            ) : null
        }
      </div>
    )
  }

  renderWhatIsUp(language: ELanguageEnv, config: any, info: ILoginResponse) {
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'what-is-up')}
        </span>
        <textarea
          value={info.whatIsUp}
          placeholder={localWithKey(language, 'input-whatisup')}
          className={`what-is-up ${config.nameInput}`}
          onChange={e => this.setState({ info: { ...info, whatIsUp: e.target.value } })}
        />
        {
          info.whatIsUp.trim() !== '' && info.whatIsUp !== this.props.info.whatIsUp ?
            (
              <span
                className={`change ${config.changeClass}`}
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  this.saveInfo({ whatIsUp: info.whatIsUp.trim() })
                }}
              >
                {localWithKey(language, 'save')}
              </span>
            ) : null
        }
      </div>
    )
  }

  renderSex(language: ELanguageEnv, config: any, color: string, family: string, info: ILoginResponse) {
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'sex')}
        </span>
        <Group
          onChange={e => this.saveBase({ sex: e.target.value })}
          value={info.sex}
        >
          <Radio value={0}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'secrecy')}</span>
          </Radio>
          <Radio value={1}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'male')}</span>
          </Radio>
          <Radio value={2}>
            <span
              className="value"
              style={{ color, fontFamily: family }}
            >{localWithKey(language, 'female')}</span>
          </Radio>
        </Group>
      </div>

    )
  }

  renderBirthday(language: ELanguageEnv, config: any, info: ILoginResponse) {
    const dateFormat = 'YYYY-MM-DD'
    let locale = this.getLocale(language)
    let birthday = moment(info.birthday, dateFormat)
    if (!birthday.isValid()) {
      birthday = null
    }
    return (
      <div className={`base ${config.borderBottom}`}>
        <span className="name-tag">
          {localWithKey(language, 'birthday')}
        </span>
        <DatePicker
          disabledDate={e => {
            if (!e) {
              return false
            }
            const ts = e.valueOf()
            return ts <= 0 || ts > Date.now()
          }}
          size="small"
          locale={locale}
          defaultValue={birthday}
          format={dateFormat}
          style={{ width: '190px' }}
          allowClear={false}
          onChange={e => this.setState({ info: { ...info, birthday: e.format(dateFormat) } })}
          className={`name-input ${config.nameInput}`}
        />
        {
          (info.birthday.trim() !== '' && info.birthday !== this.props.info.birthday) ?
            (
              <span
                className={`change ${config.changeClass}`}
                onClick={() => {
                  if (moment(info.birthday, dateFormat).isValid()) {
                    this.saveBase({ birthday: info.birthday.trim() })
                  } else {
                    showTips(localWithKey(language, 'date-legal'))
                  }
                }}
                style={{ marginLeft: '10px' }}
              >
                {localWithKey(language, 'save')}
              </span>
            ) : null
        }
      </div>
    )
  }

  render() {
    const { init } = this.state
    const { mode, language, fontColor, fontFamily } = this.props
    if (!init) {
      return <Loading mode={mode} />
    }
    const { info } = this.state
    const config = this.getConfig()
    const color = getFontColor(fontColor)
    const family = getFontFamily(fontFamily)
    return (
      <div
        className="base-setting"
        style={{ fontFamily: family }}
      >
        <div className="cover">
          <img className="cover-image" src={getHashUrl(info.cover)} />
          <div
            className="edit-cover"
            onClick={() => {
              const picker = document.getElementById('picker')
              picker.dataset.from = "cover"
              picker.click()
            }}
          >
            <i className="iconfont icon-ai-camera icon" />
            <span className="edit">
              {localWithKey(language, 'edit-cover')}
            </span>
          </div>
        </div>
        {this.renderAvatar(language, config, info)}
        {this.renderIDString(language, config, info)}
        {this.renderBirthday(language, config, info)}
        {this.renderSex(language, config, color, family, info)}
        {this.renderWhatIsUp(language, config, info)}
        <input
          id="picker"
          type="file"
          className="pick-file"
          accept="image/*"
          onChange={(e) => this.toPickerFile(e)}
        />
        <PicEditor
          ref={(e) => { this.editor = e }}
          mode={mode}
          fontFamily={fontFamily}
          language={language}
        />
        <Confirm
          ref={(e) => { this.confirm = e }}
          mode={mode}
          fontFamily={fontFamily}
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
    mode,
    language,
    fontColor,
    fontFamily,
    info
  }
}

export default connect(mapStateToProps)(PersonInfo)