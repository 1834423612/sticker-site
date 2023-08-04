import {restfuls} from 'entrance';

const SMSApiURL = import.meta.env.VITE_TENCENT_SMS_URL;

const api = {
  getRegisterState(params){ //判断是否已注册。注意!get方式的请求params外面需要包裹一个大括号
    return restfuls.get({ SMSApiURL },{ params }); //注册的接口地址
  },
  getCodeBySms(params){ //获取短信验证码 post参数不需要加大括号
    return restfuls.post(0,params); // 获取短信验证码的接口地址
  },
  getCodeByEmail(params){ //获取邮箱验证码
    return restfuls.post(获取邮箱验证码的接口地址,params);
  },
  getCodeByVoice(params){ //获取语音验证码
    return restfuls.post(获取语音验证码的接口地址,params);
  },
  register(params){ //快速注册
    return restfuls.post(快速注册的接口地址,params);
  },
  login(params){ //快速登录
    return restfuls.post(快速登录的接口地址,params);
  },
  setPassword(params){ //第一次设置密码
    return restfuls.post(第一次设置密码的接口地址,params);
  },
  resetPassword(params){ //找回密码
    return restfuls.post(找回密码的接口地址,params);
  },
  isCaptcha(params){ //获取图形验证码
    return restfuls.get(获取图形验证码接口地址, {params});
  }
}